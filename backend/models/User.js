const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  favorites: [
    {
      movieId: {
        type: Number,
        required: true
      }
    }
  ],
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: ""
  },
  profilePicture: {
    type: String,
    default: ""
  },
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
