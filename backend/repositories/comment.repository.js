const Comment = require("../models/Comment");

exports.create = async (data) => {
  return await Comment.create(data);
};

exports.findByMovieId = async (movieId) => {
  return await Comment.find({ movieId })
    .populate("user", "username") // only return username
    .sort({ createdAt: -1 });
};

exports.findById = async (id) => {
  return await Comment.findById(id);
};

exports.delete = async (id) => {
  return await Comment.findByIdAndDelete(id);
};