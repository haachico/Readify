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

const [isCommentModalOpen, setCommentModalOpen] = useState(false);
const [comments, setComments] = useState([]); // You will fetch these from API


  const handleComment = () => {
    setCommentModalOpen(true);
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
            src={image}
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
          <textarea
            rows={4}
            column={40}
            type="text"
            value={editedPost}
            onChange={(e) => setEditedPost(e.target.value)}
            style={{ width: "18rem", height: "6rem" }}
            className="editTextArea"
          />
          {editboxPreviewImg && (
            <div className="editbox-previewImg--div">
              <i
                class="fa-sharp fa-regular fa-circle-xmark"
                id="editbox-close--icon"
                onClick={() => setEditPreviewImg(null)}
              ></i>
              <img
                src={editboxPreviewImg}
                alt=""
                style={{ width: "4rem", height: "4rem" }}
                className="editbox-preview--img"
              />
            </div>
          )}
          <label
            htmlFor="editbox-file-input"
            className="editbox-img--select--label"
          >
            <i class="fa-solid fa-image" id="editbox-image-icon"></i>{" "}
          </label>
          <input
            id="editbox-file-input"
            type="file"
            accept="image/*"
            className="editbox-img--select"
            onChange={(e) =>
              setEditedImgContent(URL.createObjectURL(e.target.files[0]))
            } // Set the selected image file to the state
          />
          <button
            onClick={() => handleUpdate(postId)}
            className="editbox-update--btn"
          >
            Update
          </button>
          <button
            className="editbox-close-btn"
            onClick={() => setIsEditBoxOpen(false)}
          >
            x
          </button>
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
          {comments.length}
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
      <CommentModal
        open={isCommentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        post={{
          postId: postId,
          username: postUsername,
          content,
          imgContent,
          profileImage: image
        }}
        comments={comments}
        setComments={setComments}
        // onAddComment={e => {
        //   e.preventDefault();
        //   // handle add comment logic here
        // }}
/>
    </div>
  );
}

export default Post;
