import { useNavigate } from "react-router-dom";
import React from "react";
import { useContext } from "react";
import { LoginProvider } from "..";
import { Link } from "react-router-dom";

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
  postId,
  isBookmarked,
  onBookmarkChange,
  likedBy,
  fetchWithAuth
}) {
  const [isEditBoxOpen, setIsEditBoxOpen] = React.useState(false);
  const [editedPost, setEditedPost] = React.useState(content);
  const [editboxPreviewImg, setEditPreviewImg] = React.useState(imgContent);
  const [editedImgContent, setEditedImgContent] = React.useState("");
  const [editedImgFile, setEditedImgFile] = React.useState(null);
  const {
    username,
    userID,
    handleLike,
    handleDislike,
    handleBookmark,
    handleRemoveBookmark,
    handleDelete,
  } = useContext(LoginProvider);

  const navigate = useNavigate();
  
  const handleComment = () => {
    navigate(`/post/${postId}`);
  }

  // Open edit modal and initialize state
  const handleEdit = () => {
    setIsEditBoxOpen(true);
    setEditedPost(content);
    setEditPreviewImg(imgContent);
    setEditedImgContent("");
    setEditedImgFile(null);
  };

  // Update post API call
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("content", editedPost);
      if (editedImgFile) {
        formData.append("image", editedImgFile);
      }
      // imgContent is not needed in formData for update

      let response;
      if (fetchWithAuth) {
        response = await fetchWithAuth(`/api/posts/edit/${postId}`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`/api/posts/edit/${postId}`, {
          method: "POST",
          body: formData,
        });
      }

      if (response && response.ok) {
        setIsEditBoxOpen(false);
        setEditedImgFile(null);
        setEditedImgContent("");
        setEditPreviewImg(null);
        if (onBookmarkChange) onBookmarkChange(); // Refresh feed
      }
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };
  
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
            <h4 style={{ marginBottom: "0px" }}>
              <Link to={`/profile/${postUsername}`}>
                {firstName}
              </Link>
            </h4>
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
                  className="fa-solid fa-pen-to-square"
                  onClick={handleEdit}
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
      
      {/* Edit Modal - kept inside Post */}
      {isEditBoxOpen && (
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
                  setEditPreviewImg(URL.createObjectURL(file));
                  setEditedImgFile(file);
                }
              }}
            />
            <button
              onClick={handleUpdate}
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
        {isLiked ? (
          <span onClick={() =>{ 
            handleDislike(postId);
            setTimeout(() => {
              if(onBookmarkChange) onBookmarkChange();
            }, 500);
          }}>
            <i className="fa-solid fa-heart"></i>
            {likesCount}
          </span>
        ) : (
          <span onClick={() => {
            handleLike(postId);
            setTimeout(() => {
              if(onBookmarkChange) onBookmarkChange();
            }, 500);
          }}>
            <i className="fa-regular fa-heart"></i>
            {likesCount}
          </span>
        )}
        <span onClick={handleComment}>
          <i className="fa-regular fa-comment"></i>
          {commentsCount}
        </span>

        {isBookmarked ? (
          <span onClick={() => {
            handleRemoveBookmark(postId);
            if (onBookmarkChange) onBookmarkChange();
          }}>
            <i className="fa-solid fa-bookmark"></i>
          </span>
        ) : (
          <span onClick={() => {
            handleBookmark(postId);
            if (onBookmarkChange) onBookmarkChange();
          }}>
            <i className="fa-regular fa-bookmark"></i>
          </span>
        )}
        {postUsername === username && (
          <span onClick={() => {
            handleDelete(postId);
            if(onBookmarkChange) onBookmarkChange();
          }}>
            <i className="fa-solid fa-trash-can"></i>
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;