const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { body, } = require("express-validator");

// Create Post
router.post(
  "/",
  protect,
  upload.single("image"),

  [
    body("content")
      .custom((value, { req }) => {

        if (
          !value &&
          !req.file
        ) {

          throw new Error(
            "Post cannot be empty"
          );
        }

        return true;
      }),
  ],

  createPost
);

// Get All Posts
router.get("/", getPosts);

// Get Single Post
router.get("/:id", getPostById);

// Update Post
router.put("/:id", protect, updatePost);

// Delete Post
router.delete("/:id", protect, deletePost);

// Like / Unlike Post
router.put("/:id/like", protect, toggleLikePost);

// Add Comment
router.post("/:id/comment", protect, addComment);

module.exports = router;