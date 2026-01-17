import React from "react";

function PostBox({
  content,
  setContent,
  isPostboxOpen,
  setIsPostBoxOpen,
  firstName,
  preview,
  profileImg,
  imgContent,
  setImgContent,
  handlePost,
  handlePrevImgCloseClick,
}) {
  return (
    <div>
      {isPostboxOpen && <div className="postbox--backdrop" onClick={() => setIsPostBoxOpen(false)} />}
      <div className={`postbox--div ${isPostboxOpen ? "noBlur" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <img src={profileImg} className="postbox--profile" alt="profile" />
          <button className="close--btn" onClick={() => setIsPostBoxOpen(false)}>
            ✕
          </button>
        </div>
        
        <textarea
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder={`Start writing here, ${firstName}!`}
        />

        {preview && (
          <div className="previewImg--div">
            <i
              className="fa-sharp fa-regular fa-circle-xmark"
              id="close--icon"
              onClick={handlePrevImgCloseClick}
            ></i>
            <img
              src={preview}
              alt="preview"
              className="preview--img"
            />
          </div>
        )}

        <div className="post-actions">
          <label htmlFor="file-input" className="img--select--label" title="Upload image">
            <i className="fa-solid fa-image"></i>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="img--select"
            onChange={(e) =>
              setImgContent(URL.createObjectURL(e.target.files[0]))
            }
          />
          <button onClick={handlePost} className="post--btn">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostBox;
