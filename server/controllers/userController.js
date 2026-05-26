const User = require("../models/User");

// FOLLOW / UNFOLLOW USER
const toggleFollowUser = async (req, res) => {
  try {

    // Cannot follow yourself
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const userToFollow = await User.findById(req.params.id);

    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyFollowing =
      currentUser.following.includes(userToFollow._id);

    if (alreadyFollowing) {

      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToFollow._id.toString()
      );

      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );

    } else {

      // Follow
      currentUser.following.push(userToFollow._id);

      userToFollow.followers.push(currentUser._id);

    }

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      followingCount: currentUser.following.length,
      followersCount: userToFollow.followers.length,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER PROFILE
const getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE USER PROFILE
const updateUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.username =
      req.body.username || user.username;

    user.bio =
      req.body.bio || user.bio;

    user.profilePicture =
      req.body.profilePicture || user.profilePicture;

    const updatedUser = await user.save();

    const userResponse = updatedUser.toObject();

    delete userResponse.password;

    res.status(200).json(userResponse);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SEARCH USERS
const searchUsers = async (req, res) => {
  try {

    const query = req.query.query;

    const users = await User.find({
      username: {
        $regex: query,
        $options: "i",
      },
    }).select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const cloudinary = require("../config/cloudinary");

// UPLOAD PROFILE IMAGE
const uploadProfilePicture = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "connectsphere_profiles",
      },
      async (error, uploadedImage) => {

        if (error) {
          return res.status(500).json({
            message: error.message,
          });
        }

        const user = await User.findById(req.user._id);

        user.profilePicture = uploadedImage.secure_url;

        await user.save();

        res.status(200).json({
          profilePicture: uploadedImage.secure_url,
        });
      }
    );

    result.end(req.file.buffer);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  toggleFollowUser,
  getUserProfile,
  updateUserProfile,
  searchUsers,
  uploadProfilePicture,
};