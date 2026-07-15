const commentRepository = require("../repositories/comment.repository");

exports.addComment = async (userId, movieId, content) => {
  if (!content || content.trim() === "") {
    throw new Error("Comment cannot be empty");
  }

  return await commentRepository.create({
    user: userId,
    movieId,
    content,
  });
};

exports.getMovieComments = async (movieId) => {
  return await commentRepository.findByMovieId(movieId);
};

exports.deleteComment = async (commentId, userId) => {
  const comment = await commentRepository.findById(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  // Only comment owner can delete
  if (comment.user.toString() !== userId) {
    throw new Error("Not authorized to delete this comment");
  }

  await commentRepository.delete(commentId);

  return { message: "Comment deleted successfully" };
};