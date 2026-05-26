import { useEffect, useState } from "react";
import {
  FaHeart,
  FaRegComment,
  FaImage
} from "react-icons/fa";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";

function HomePage() {

  const { user, token } = useAuth();
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // FETCH POSTS
  const fetchPosts = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/posts"
      );

      const data = await response.json();

      setPosts(data);

    } catch (error) {

      console.log(error);
    }
  };

  // LIKE POST
  const handleLikePost = async (postId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {

      await fetch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPosts();

    } catch (error) {

      console.log(error);
    }
  };

  // COMMENT POST
  const handleComment = async (postId) => {
    if (!user) {
      alert("Please login first");
      return;
    }
    if (!commentText[postId]?.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    try {

      await fetch(
        `http://localhost:5000/api/posts/${postId}/comment`,
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

      fetchPosts();

    } catch (error) {

      console.log(error);
    }
  };

  // DELETE POST
  const handleDeletePost = async (postId) => {

    try {

      await fetch(
        `http://localhost:5000/api/posts/${postId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPosts();

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
        `http://localhost:5000/api/posts/${postId}`,
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

      fetchPosts();

    } catch (error) {

      console.log(error);
    }
  };

  // CREATE POST
  const handleCreatePost = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }
    if (!content.trim() && !selectedImage) {
      alert("Post cannot be empty");
      return;
    }

    try {


      setIsPosting(true);
      const formData = new FormData();

      formData.append("content", content);

      if (selectedImage) {

        formData.append(
          "image",
          selectedImage
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/posts",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );
      const data = await response.json();

      console.log(data);

      fetchPosts();

      setContent("");

      setSelectedImage(null);

      setIsPosting(false);

    } catch (error) {

      console.log(error);

      setIsPosting(false);

      alert("Something went wrong");
    }
  };

  // LOAD POSTS
  useEffect(() => {

    fetchPosts();

  }, []);

  return (
    <div className="min-h-screen bg-[#fdf2f8] py-10 px-4">

      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* CREATE POST CARD */}
        {user && (
          <div className="bg-white p-6 rounded-3xl shadow-md border border-pink-100">

            <div className="flex items-center gap-4 mb-4">

              <div className="w-14 h-14 rounded-full overflow-hidden bg-pink-500 flex items-center justify-center">

                {user?.profilePicture ? (

                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />

                ) : (

                  <span className="text-white font-bold text-xl">

                    {user?.username
                      ? user.username
                        .charAt(0)
                        .toUpperCase()
                      : "U"}

                  </span>

                )}

              </div>

              <div>

                <h2 className="font-bold text-lg text-gray-800">
                  {user?.username}
                </h2>

                <p className="text-gray-500 text-sm">
                  Share something today
                </p>

              </div>

            </div>

            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              className="w-full p-4 rounded-2xl border border-pink-200 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
              rows="4"
            />
            <label className="mt-4 flex items-center gap-3 cursor-pointer w-fit">

              <div className="bg-pink-100 hover:bg-pink-200 transition p-3 rounded-full">

                <FaImage className="text-pink-500 text-xl" />

              </div>

              <span className="text-gray-600 text-sm">

                {selectedImage
                  ? selectedImage.name
                  : "Add Photo"}

              </span>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedImage(
                    e.target.files[0]
                  )
                }
                className="hidden"
              />

            </label>

            {selectedImage && (

              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="mt-4 rounded-2xl max-h-75 object-cover shadow-md border border-pink-100"
              />

            )}

            <button
              disabled={isPosting}
              onClick={handleCreatePost}
              className="mt-4 bg-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition"
            >
              {isPosting ? "Posting..." : "Create Post"}
            </button>

          </div>
        )}

        {/* POSTS */}
        {posts.length === 0 ? (

          <div className="bg-white p-10 rounded-3xl text-center shadow-md border border-pink-100">

            <h2 className="text-2xl font-bold text-gray-700">
              No posts yet ✨
            </h2>

            <p className="text-gray-500 mt-2">
              Be the first one to post something!
            </p>

          </div>

        ) : (

          posts.map((post) => (

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

          ))
        )}

      </div>

    </div>
  );
}

export default HomePage;