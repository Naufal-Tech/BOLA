import moment from "moment-timezone";
import mongoose from "mongoose";

const defaultDate = () => moment.tz(Date.now(), "Asia/Jakarta").valueOf();

const MatchSchema = new mongoose.Schema(
  {
    clubHome: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "club",
      required: true,
    },

    clubAway: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "club",
      required: true,
    },

    score: {
      homeScore: {
        type: Number,
        default: 0,
      },
      awayScore: {
        type: Number,
        default: 0,
      },
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
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

// Define a virtual getter for created_at in "Asia/Jakarta" timezone
MatchSchema.virtual("CreatedAt").get(function () {
  return moment
    .tz(this.created_at, "Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
});

// Define a virtual getter for created_at in "Asia/Jakarta" timezone
MatchSchema.virtual("UpdatedAt").get(function () {
  return moment
    .tz(this.updated_at, "Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
});

// Define a virtual getter for created_at in "Asia/Jakarta" timezone
MatchSchema.virtual("DeletedAt").get(function () {
  return moment
    .tz(this.deleted_at, "Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
});

const MatchDB = mongoose.model("match", MatchSchema, "match");

export default MatchDB;
