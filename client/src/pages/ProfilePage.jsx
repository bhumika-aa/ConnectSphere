import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {

  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const { id } = useParams();
  const { user, token } = useAuth();
  const currentUser = user;

  const [isEditing, setIsEditing] =
    useState(false);

  const [username, setUsername] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [isSaving, setIsSaving] =
    useState(false);

  // FETCH USER PROFILE
  const fetchUserProfile = async () => {

    try {

      const response = await fetch(
        `https://connectsphere-api.onrender.com/api/users/${id || currentUser.id}`
      );

      const data = await response.json();

      setUserData(data);

    } catch (error) {

      console.log(error);
    }
  };

  // FETCH USER POSTS
  const fetchUserPosts = async () => {

    try {

      const response = await fetch(
        "https://connectsphere-api.onrender.com/api/posts"
      );

      const data = await response.json();

      const filteredPosts = data.filter(
        (post) =>
          post.author._id === (id || currentUser.id)
      );

      setUserPosts(filteredPosts);

    } catch (error) {

      console.log(error);
    }
  };

  const handleUpdateProfile = async () => {

    try {

      setIsSaving(true);

      // UPDATE USER INFO
      const response = await fetch(
        "https://connectsphere-api.onrender.com/api/users/profile/update",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            username,
            bio,
          }),
        }
      );

      const updatedUser = await response.json();

      // UPLOAD IMAGE IF EXISTS
      if (selectedImage) {

        const imageData = new FormData();

        imageData.append(
          "image",
          selectedImage
        );

        await fetch(
          "https://connectsphere-api.onrender.com/api/users/profile/upload",
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
            },

            body: imageData,
          }
        );
      }

      // REFRESH PROFILE DATA
      await fetchUserProfile();

      // GET LATEST USER DATA
      const updatedProfileResponse = await fetch(
        `https://connectsphere-api.onrender.com/api/users/${id || currentUser.id}`
      );

      const latestUser =
        await updatedProfileResponse.json();

      // UPDATE LOCAL STORAGE
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          username: latestUser.username,
          profilePicture:
            latestUser.profilePicture,
        })
      );

      setIsEditing(false);

      setIsSaving(false);

      alert("Profile updated successfully");

    } catch (error) {

      console.log(error);

      setIsSaving(false);

      alert("Something went wrong");
    }
  };

  const handleLikePost = async (postId) => {
    if (!currentUser) {
      alert("Please login first");
      return;
    }

    try {

      await fetch(
        `https://connectsphere-api.onrender.com/api/posts/${postId}/like`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUserPosts();

    } catch (error) {

      console.log(error);
    }
  };

  const handleComment = async (postId) => {
    if (!currentUser) {
      alert("Please login first");
      return;
    }

    if (!commentText[postId]?.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {

      await fetch(
        `https://connectsphere-api.onrender.com/api/posts/${postId}/comment`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            text: commentText[postId],
          }),
        }
      );

      setCommentText({
        ...commentText,
        [postId]: "",
      });

      fetchUserPosts();

    } catch (error) {

      console.log(error);
    }
  };

  // DELETE POST
  const handleDeletePost = async (postId) => {

    try {

      await fetch(
        `https://connectsphere-api.onrender.com/api/posts/${postId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUserPosts();

    } catch (error) {

      console.log(error);
    }
  };

  // UPDATE POST
  const handleUpdatePost = async (
    postId,
    updatedContent
  ) => {

    try {

      await fetch(
        `https://connectsphere-api.onrender.com/api/posts/${postId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            content: updatedContent,
          }),
        }
      );

      fetchUserPosts();

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchUserProfile();
    fetchUserPosts();

  }, [id]);

  useEffect(() => {

    if (userData) {

      setUsername(userData.username || "");

      setBio(userData.bio || "");
    }

  }, [userData]);

  return (
    <div className="min-h-screen bg-[#fdf2f8] p-6">

      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-3xl shadow-md p-8 border border-pink-100">

          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* PROFILE IMAGE */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-pink-500 flex items-center justify-center">

              {userData?.profilePicture ? (

                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />

              ) : (

                <span className="text-white text-5xl font-bold">

                  {userData?.username
                    ?.charAt(0)
                    .toUpperCase()}

                </span>

              )}

            </div>

            {/* PROFILE INFO */}
            <div className="flex-1">

              <h2 className="text-3xl font-bold text-gray-800">
                {userData?.username}
              </h2>

              <p className="text-gray-500 mt-2">
                {userData?.bio || "No bio yet ✨"}
              </p>

              {/* STATS */}
              <div className="flex gap-8 mt-6">

                <div>
                  <h3 className="font-bold text-xl">
                    {userPosts.length}
                  </h3>

                  <p className="text-gray-500">
                    Posts
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl">
                    {userData?.followers?.length || 0}
                  </h3>

                  <p className="text-gray-500">
                    Followers
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl">
                    {userData?.following?.length || 0}
                  </h3>

                  <p className="text-gray-500">
                    Following
                  </p>
                </div>

              </div>

              {/* BUTTON */}
              {(!id || id === currentUser.id) && (

                <button
                  onClick={() =>
                    setIsEditing(true)
                  }
                  className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition"
                >

                  Edit Profile

                </button>)}

            </div>

          </div>

        </div>

        {/* USER POSTS */}
        <div className="mt-8 flex flex-col gap-6">

          {userPosts.map((post) => (

            <PostCard
              key={post._id}
              post={post}
              handleLikePost={handleLikePost}
              handleAddComment={handleComment}
              commentText={commentText}
              setCommentText={setCommentText}
              showComments={showComments}
              setShowComments={setShowComments}
              handleDeletePost={handleDeletePost}
              handleUpdatePost={handleUpdatePost}
            />

          ))}

        </div>

      </div>
      {/* EDIT PROFILE MODAL */}
      {isEditing && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-[90%] max-w-lg shadow-2xl animate-fadeIn">

            <h2 className="text-3xl font-bold text-gray-800 mb-6">

              Edit Profile

            </h2>

            {/* USERNAME */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full border border-pink-200 rounded-2xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* BIO */}
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              rows="4"
              className="w-full border border-pink-200 rounded-2xl px-4 py-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* IMAGE */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSelectedImage(
                  e.target.files[0]
                )
              }
              className="mb-6"
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-4">

              <button
                onClick={() =>
                  setIsEditing(false)
                }
                className="px-5 py-2 rounded-2xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProfile}
                disabled={isSaving}
                className="bg-pink-500 text-white px-6 py-2 rounded-2xl hover:bg-pink-600 transition"
              >

                {isSaving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </div>

        </div>

      )}


    </div >
  );
}

export default ProfilePage;