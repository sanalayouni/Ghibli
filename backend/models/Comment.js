const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: String, // external API movie ID
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);