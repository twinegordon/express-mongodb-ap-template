// Import mongoose ORM
const mongoose = require("mongoose");

// Create user model
const UserModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      max: 30,
      min: 4,
    },
    firstName: {
      type: String,
      required: true,
      unique: true,
      max: 30,
      min: 4,
    },
    lastName: {
      type: String,
      required: true,
      unique: true,
      max: 30,
      min: 4,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      max: 10,
      min: 9,
    },
    birthday: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      max: 30,
      min: 8,
    },
    profileImage: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

// Export this model for import in the routes that will need to use it
module.exports = mongoose.model("User", UserModel);
