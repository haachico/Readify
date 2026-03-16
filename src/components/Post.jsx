import { useNavigate } from "react-router-dom";
import React from "react";
import { useContext } from "react";
import { LoginProvider } from "..";
import { Link } from "react-router-dom";
import { useState } from "react";
import CommentModal from "./CommentModal";

function Post({
  postUsername,
  image,
  firstName,
  lastName,
  content,
  imgContent,
  likesCount,
  commentsCount,
  createdAt,
  handleEdit,
  postId,
  editedPostID,
  isEditBoxOpen,
  setIsEditBoxOpen,
  editedPost,
  setEditedPost,
  editboxPreviewImg,
  setEditPreviewImg,
  setEditedImgContent,
  setEditedImgFile,
  handleUpdate,
  isBookmarked,
  onBookmarkChange,
  likedBy
}) {
  const {
    username,
    userID,
    likedPosts,
    bookmarkPosts,
    handleLike,
    handleDislike,
    handleBookmark,
    handleRemoveBookmark,
    handleDelete,
    // handleComment
  } = useContext(LoginProvider);

const navigate = useNavigate();
  const handleComment = () => {
    navigate(`/post/${postId}`);
  }
  const getDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options).replace(/,/g, "");
  };

  console.log("likedBy:", likedBy, "userID:", userID);

  let isLiked = likedBy?.includes(userID) || false;
  return (
    <div className="post">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "1rem",
        }}
      >
        <Link to={`/profile/${postUsername}`}>
          <img
            src={image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
            alt={postUsername}
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
            }}
          />
        </Link>

        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              gap: "5px",
              justifyContent: "flex-start",
              alignItems: "flex-end",
            }}
          >
            {" "}
            <h4 style={{ marginBottom: "0px" }}>
              <Link to={`/profile/${postUsername}`} style={{ height: "" }}>
                {firstName}
              </Link>
            </h4>{" "}
            <h4 style={{ marginBottom: "0px" }}>
              <Link to={`/profile/${postUsername}`}>{lastName}</Link>
            </h4>
            <span>•</span>
            <p
              style={{
                marginBottom: "2px",
                marginTop: "0px",
                fontSize: "12px",
              }}
            >
              {getDate(createdAt)}
            </p>
            {postUsername === username && (
              <span
                style={{
                  marginLeft: "auto",
                  cursor: "pointer",
                }}
              >
                <i
                  class="fa-solid fa-pen-to-square"
                  onClick={() => handleEdit(postId)}
                ></i>
              </span>
            )}
          </div>
          <div style={{ marginTop: "-5px" }}>
            <p style={{ fontSize: "12px", marginTop: "5px" }}>
              @{postUsername}
            </p>
          </div>
        </div>
      </div>
      {postId === editedPostID && isEditBoxOpen && (
        <div className="editBox--div">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h3 style={{ margin: 0, color: "#00b8ff" }}>Edit Post</h3>
            <button
              className="editbox-close-btn"
              onClick={() => setIsEditBoxOpen(false)}
            >
              ✕
            </button>
          </div>
          <textarea
            rows={4}
            column={40}
            type="text"
            value={editedPost}
            onChange={(e) => setEditedPost(e.target.value)}
            className="editTextArea"
            placeholder="Update your post..."
          />
          {editboxPreviewImg && (
            <div className="editbox-previewImg--div">
              <i
                className="fa-sharp fa-regular fa-circle-xmark"
                id="editbox-close--icon"
                onClick={() => setEditPreviewImg(null)}
              ></i>
              <img
                src={editboxPreviewImg}
                alt="preview"
                className="editbox-preview--img"
              />
            </div>
          )}
          <div className="editbox-actions">
            <label
              htmlFor="editbox-file-input"
              className="editbox-img--select--label"
              title="Upload image"
            >
              <i className="fa-solid fa-image" id="editbox-image-icon"></i>
            </label>
            <input
              id="editbox-file-input"
              type="file"
              accept="image/*"
              className="editbox-img--select"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // Store preview blob URL
                  setEditPreviewImg(URL.createObjectURL(file));
                  // Store actual File object for upload
                  if (setEditedImgFile) setEditedImgFile(file);
                }
              }}
            />
            <button
              onClick={() => handleUpdate(postId)}
              className="editbox-update--btn"
            >
              Update
            </button>
          </div>
        </div>
      )}
      <div style={{ margin: "2rem 0" }}>
        <p>{content}</p>
      </div>
      {imgContent && (
        <img
          src={imgContent}
          alt=""
          style={{ width: "100%", height: "25rem" }}
        />
      )}
      <div className="post--btns">
        <div>
          {isLiked ? (
            <span onClick={() =>{ handleDislike(postId)

            setTimeout(() => {
                if( onBookmarkChange) onBookmarkChange();
              }, 500);
            }}>
              <i class="fa-solid fa-heart"></i>
            </span>
          ) : (
            <span onClick={() => {handleLike(postId)

              setTimeout(() => {
                if( onBookmarkChange) onBookmarkChange();
              }, 500);
            }}>
              <i class="fa-regular fa-heart"></i>
            </span>
          )}{" "}
          {likesCount}
        </div>
        <span onClick={handleComment}>
          <i class="fa-regular fa-comment"></i>
          {commentsCount}
        </span>

        {isBookmarked ? (
          <span onClick={() => {
            handleRemoveBookmark(postId);
            if (onBookmarkChange) onBookmarkChange();
          }}>
            {" "}
            <i class="fa-solid fa-bookmark"></i>
          </span>
        ) : (
          <span onClick={() => {
            handleBookmark(postId);
            if (onBookmarkChange) onBookmarkChange();
          }}>
            <i class="fa-regular fa-bookmark"></i>
          </span>
        )}
        {postUsername === username && (
          <span onClick={() => {
            handleDelete(postId)
            if( onBookmarkChange) onBookmarkChange();
          
          }
            
            
            }>
            <i class="fa-solid fa-trash-can"></i>
          </span>
        )}
      </div>
      {/* CommentModal removed. Comment functionality moved to PostDetails page. */}
    </div>
  );
}

export default Post;
