import {
  FaHeart,
  FaRegComment,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

import { useState } from "react";

function PostCard({
  post,
  handleLikePost,
  handleAddComment,
  handleDeletePost,
  handleUpdatePost,
  commentText,
  setCommentText,
  showComments,
  setShowComments,
}) {

  const storedUser = localStorage.getItem("user");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  const isOwner =
    currentUser?.id === post.author?._id;

  const [isEditing, setIsEditing] =
    useState(false);

  const [updatedContent, setUpdatedContent] =
    useState(post.content);

  const handleSaveUpdate = () => {

    if (!updatedContent.trim()) {
      alert("Post cannot be empty");
      return;
    }

    handleUpdatePost(
      post._id,
      updatedContent
    );

    setIsEditing(false);
  };

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  return (

  <div className="bg-white p-6 rounded-3xl shadow-md border border-pink-100 hover:shadow-xl transition duration-300">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-full overflow-hidden bg-pink-500 flex items-center justify-center">

            {post.author?.profilePicture ? (

              <img
                src={post.author.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

            ) : (

              <span className="text-white font-bold">

                {post.author?.username
                  ?.charAt(0)
                  .toUpperCase()}

              </span>

            )}

          </div>

          <div>

            <h3 className="font-bold text-gray-800">
              {post.author?.username}
            </h3>

            <p className="text-sm text-gray-500">
              {new Date(
                post.createdAt
              ).toLocaleString()}
            </p>

          </div>

        </div>

        {/* EDIT + DELETE */}
        {isOwner && (
          <div className="flex gap-3">

            <button
              onClick={() =>
                setIsEditing(!isEditing)
              }
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>

            <button
              onClick={() =>
                setShowDeleteModal(true)
              }
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>

          </div>
        )}

      </div>

      {/* CONTENT */}
      {isEditing ? (
        <div className="flex flex-col gap-3">

          <textarea
            value={updatedContent}
            onChange={(e) =>
              setUpdatedContent(
                e.target.value
              )
            }
            className="w-full border border-pink-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
            rows="4"
          />

          <button
            onClick={handleSaveUpdate}
            className="bg-pink-500 text-white px-5 py-2 rounded-2xl hover:bg-pink-600 transition"
          >
            Save Changes
          </button>

        </div>
      ) : (
        <p className="text-gray-700 text-lg">
          {post.content}
          {post.image && (

  <img
    src={post.image}
    alt="Post"
    className="mt-4 w-full rounded-2xl object-cover max-h-125"
  />

)}
        </p>
        
      )}

      {/* ACTIONS */}
      <div className="mt-5 flex items-center gap-6 text-gray-600">

        {/* LIKE */}
        <button
          onClick={() =>
            handleLikePost(post._id)
          }
          className="flex items-center gap-2 hover:text-pink-500 transition"
        >

          <FaHeart className="text-pink-500 text-xl" />

          <span className="text-sm font-medium">
            {post.likes.length}
          </span>

        </button>

        {/* COMMENT */}
        <button
          onClick={() =>
            setShowComments({
              ...showComments,
              [post._id]:
                !showComments[post._id],
            })
          }
          className="flex items-center gap-2 hover:text-pink-500 transition"
        >

          <FaRegComment className="text-xl" />

          <span className="text-sm font-medium">
            Comment
          </span>

        </button>

      </div>

      {/* COMMENTS */}
      {showComments[post._id] && (

        <div className="mt-4">

          {/* COMMENT INPUT */}
          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Write a comment..."
              value={
                commentText[post._id] || ""
              }
              onChange={(e) =>
                setCommentText({
                  ...commentText,
                  [post._id]:
                    e.target.value,
                })
              }
              className="flex-1 border border-pink-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <button
              onClick={() =>
                handleAddComment(post._id)
              }
              className="bg-pink-500 text-white px-5 rounded-2xl hover:bg-pink-600 transition"
            >
              Post
            </button>

          </div>

          {/* COMMENTS */}
          <div className="mt-4 flex flex-col gap-3">

            {post.comments.map((comment) => (

              <div
                key={comment._id}
                className="flex items-start gap-3"
              >

                <div className="w-10 h-10 rounded-full overflow-hidden bg-pink-500 flex items-center justify-center">

                  {comment.author?.profilePicture ? (

                    <img
                      src={comment.author.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />

                  ) : (

                  <span className="text-white font-bold">

                    {comment.author?.username
                      ?.charAt(0)
                      .toUpperCase() || "U"}

                  </span>

                  )}

                </div>

                <div className="bg-pink-50 px-4 py-3 rounded-2xl flex-1">

                  <h4 className="font-semibold text-gray-800 text-sm">

                    {comment.author?.username ||
                      "Unknown User"}

                  </h4>

                  <p className="text-gray-700 text-sm mt-1">
                    {comment.text}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}
      {/* DELETE MODAL */}
      {showDeleteModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-[90%] max-w-md shadow-2xl animate-fadeIn">

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Delete Post
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post?
            </p>

            <div className="flex justify-end gap-4">

              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="px-5 py-2 rounded-2xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {

                  handleDeletePost(post._id);

                  setShowDeleteModal(false);
                }}
                className="bg-red-500 text-white px-5 py-2 rounded-2xl hover:bg-red-600 transition"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default PostCard;