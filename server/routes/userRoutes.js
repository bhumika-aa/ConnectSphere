const express = require("express");
const router = express.Router();


const {
  toggleFollowUser,
  getUserProfile,
  updateUserProfile,
  searchUsers,
  uploadProfilePicture,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// Follow / Unfollow
router.put("/:id/follow", protect, toggleFollowUser);

// Update Profile
router.put("/profile/update", protect, updateUserProfile);

// Upload Profile Picture
router.post("/profile/upload",
  protect,
  upload.single("image"),
  uploadProfilePicture
);

// Search Users
router.get("/search/users", searchUsers);

// Get User Profile
router.get("/:id", getUserProfile);

module.exports = router;