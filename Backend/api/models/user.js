// const defaultDate = moment().tz("Asia/Jakarta").format();

import { body, validationResult } from "express-validator";
import moment from "moment-timezone";
import mongoose from "mongoose";
import validator from "validator";
const defaultDate = () => moment.tz(Date.now(), "Asia/Jakarta").valueOf();

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide username"],
      minlength: 3,
      maxlength: 20,
      trim: true,
    },

    fullName: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please provide password minimal 6 characters"],
      minlength: 6,
    },

    phoneNumber: {
      type: String,
      required: [true, "Please Provide Phone Number"],
      minlength: 10,
      trim: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },

    bio: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["Laki-Laki", "Perempuan"],
      required: true,
    },

    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    slug: {
      type: String,
    },

    img_profile: {
      type: String,
      default: null,
    },

    img_profilePublic: {
      type: String,
      default: null,
    },

    /* CONFIG */
    lastLogin: {
      type: Number,
    },

    created_at: {
      type: Number,
      default: defaultDate,
    },

    updated_at: {
      type: Number,
    },

    deleted_at: {
      type: Number,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

UserSchema.virtual("LastActiveStatus").get(function () {
  const lastLogin = this.lastLogin;

  // Check if lastLogin exists
  if (lastLogin === null || lastLogin === undefined) {
    return "never logged in";
  }

  const currentDate = moment.tz("Asia/Jakarta").valueOf();
  const daysDifference = moment.duration(currentDate - lastLogin).asDays();

  if (daysDifference >= 2) {
    return `${Math.floor(daysDifference)} days ago`;
  } else if (daysDifference >= 1) {
    return "1 day ago";
  } else {
    return "recently";
  }
});

// Define a virtual getter for created_at in "Asia/Jakarta" timezone
UserSchema.virtual("CreatedAt").get(function () {
  return moment
    .tz(this.created_at, "Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
});

// Define a virtual getter for created_at in "Asia/Jakarta" timezone
UserSchema.virtual("UpdatedAt").get(function () {
  return moment
    .tz(this.updated_at, "Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
});

// Define a virtual getter for created_at in "Asia/Jakarta" timezone
UserSchema.virtual("DeletedAt").get(function () {
  return moment
    .tz(this.deleted_at, "Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
});

UserSchema.virtual("BlockedUserCount").get(function () {
  return this.isBlocked.length;
});

// Middleware for validation using Express Validator
export const validateUser = [
  body("username")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),

  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Full name must be between 3 and 20 characters"),

  body("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(async (value) => {
      // Check if email is unique
      const existingUser = await models.UserDB.findOne({ email: value });
      if (existingUser) {
        throw new Error("Email is already in use");
      }
    }),

  body("phoneNumber")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please provide phone number")
    .custom((value) => {
      if (!/^(?:\+62|62|08)\d+$/.test(value)) {
        throw new Error("Please provide a valid Indonesian phone number");
      }

      return value.replace(/\+62|62/, "0");
    }),

  body("password")
    .isLength({ min: 6 })
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password must be at least 6 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstErrorMessage = errors.array()[0].msg;
      return res.status(400).json({
        errors: errors.array(),
        status: "failed",
        success: false,
        message: firstErrorMessage,
      });
    }
    next();
  },
];

UserSchema.statics.countViewers = async function (userId) {
  try {
    const user = await this.findById(userId);
    const viewerCount = user.viewers.length;
    return viewerCount;
  } catch (error) {
    throw error;
  }
};

// Remove Password:
UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

// Slugify
UserSchema.pre("save", function (next) {
  this.slug = slugify(this.fullName, { lower: true });
  next();
});

// Generate Auth Token
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  return token;
};

// Compared Password
UserSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

UserSchema.pre("save", function (next) {
  this.username = this.username.toLowerCase();
  next();
});

const UserDB = mongoose.model("user", UserSchema, "user");

export default UserDB;
