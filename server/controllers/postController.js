const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const { validationResult, } = require("express-validator");

// CREATE POST
const createPost = async (req, res) => {
  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({
      message:
        errors.array()[0].msg,
    });
  }
  try {

    const { content } = req.body;

    let imageUrl = "";

    // UPLOAD IMAGE IF EXISTS
    if (req.file) {

      const uploadedImage =
        await new Promise((resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "connectsphere_posts",
              },
              (error, result) => {

                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          stream.end(req.file.buffer);
        });

      imageUrl =
        uploadedImage.secure_url;
    }

    const post = await Post.create({
      content,
      image: imageUrl,
      author: req.user._id,
    });

    const populatedPost =
      await Post.findById(post._id)
        .populate(
          "author",
          "username profilePicture"
        );

    res.status(201).json(populatedPost);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL POSTS
const getPosts = async (req, res) => {
  try {

    const posts = await Post.find()
      .populate("author", "username profilePicture")
      .populate("comments.author", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE POST
const getPostById = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id)
      .populate("author", "username profilePicture")
      .populate(
        "comments.author",
        "username profilePicture"
      );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE POST
const updatePost = async (req, res) => {
  try {

    const { content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    post.content = content || post.content;

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE POST
const deletePost = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LIKE / UNLIKE POST
const toggleLikePost = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check if user already liked
    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {

      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );

    } else {

      // Like
      post.likes.push(req.user._id);

    }

    await post.save();

    res.status(200).json({
      likes: post.likes.length,
      likedUsers: post.likes,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD COMMENT
const addComment = async (req, res) => {
  try {

    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = {
      text,
      author: req.user._id,
    };

    post.comments.push(comment);

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("comments.author", "username profilePicture");

    res.status(201).json(updatedPost.comments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
};