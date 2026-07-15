const commentService = require("../services/comment.service");

exports.addComment = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { content } = req.body;

    const comment = await commentService.addComment(
      req.user.id,
      movieId,
      content
    );

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const comments = await commentService.getMovieComments(movieId);

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const result = await commentService.deleteComment(
      commentId,
      req.user.id
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};