const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      // unique: false,
    },

    email: {
      type: String,
      require: true,
      max: 50,
      // unique: false,
    },

    password: {
      type: String,
      require: true,
      min: 6,
    },
    isLiked: {
      type: Boolean,
      require: true,
    },
  },
  { timestamps: true } // automatically created and updated
);

module.exports = mongoose.model("User", UserSchema);
