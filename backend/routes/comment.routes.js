const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// Add comment
router.post("/movies/:movieId/comments",authMiddleware,commentController.addComment);

// Get comments for a movie
router.get("/movies/:movieId/comments",commentController.getComments);

// Delete comment
router.delete("/comments/:commentId",authMiddleware,commentController.deleteComment);

module.exports = router;