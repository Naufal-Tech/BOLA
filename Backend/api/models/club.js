// const defaultDate = moment().tz("Asia/Jakarta").format();

import { body, validationResult } from "express-validator";
import moment from "moment-timezone";
import mongoose from "mongoose";
const defaultDate = () => moment.tz(Date.now(), "Asia/Jakarta").valueOf();

const ClubSchema = new mongoose.Schema(
  {
    club_name: {
      type: String,
      required: [true, "Please provide team name"],
      minlength: 3,
      maxlength: 20,
      trim: true,
      unique: true,
    },

    kota: {
      type: String,
      trim: true,
      required: [true, "Please provide kota"],
      minlength: 3,
      maxlength: 20,
      trim: true,
      unique: true,
    },

    stadium: {
      type: String,
      required: [true, "Please provide email"],
      minlength: 3,
      trim: true,
      unique: true,
    },

    wins: {
      type: Number,
      default: 0,
    },

    loses: {
      type: Number,
      default: 0,
    },

    draws: {
      type: Number,
      default: 0,
    },

    total_goals: {
      type: Number,
      default: 0,
    },

    goals_against: {
      type: Number,
      default: 0,
    },

    goal_difference: {
      type: Number,
      default: 0,
    },

    total_points: {
      type: Number,
      default: 0,
    },

    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "matches",
      },
    ],

    slug: {
      type: String,
    },

    img_club: {
      type: String,
      default: null,
    },

    img_clubPublic: {
      type: String,
      default: null,
    },

    /* CONFIG */
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

// Define a virtual getter for created_at in "Asia/Jakarta" timezone
ClubSchema.virtual("CreatedAt").get(function () {
  return moment
    .tz(this.created_at, "Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
});

// Define a virtual getter for created_at in "Asia/Jakarta" timezone
ClubSchema.virtual("UpdatedAt").get(function () {
  return moment
    .tz(this.updated_at, "Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
});

// Define a virtual getter for created_at in "Asia/Jakarta" timezone
ClubSchema.virtual("DeletedAt").get(function () {
  return moment
    .tz(this.deleted_at, "Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
});

// Middleware for validation using Express Validator
export const validateClub = [
  body("club_name")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 20 })
    .withMessage("Club name must be between 3 and 20 characters"),

  body("kota")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Kota must be between 3 and 20 characters"),

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

// Slugify
ClubSchema.pre("save", function (next) {
  this.slug = slugify(this.club_name, { lower: true });
  next();
});

ClubSchema.pre("save", function (next) {
  // Capitalize the first letter of club_name
  this.club_name =
    this.club_name.charAt(0).toUpperCase() +
    this.club_name.slice(1).toLowerCase();
  next();
});

const ClubDB = mongoose.model("club", ClubSchema, "club");

export default ClubDB;
