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
      <div className={`postbox--div ${isPostboxOpen ? "noBlur" : ""}`}>
        <textarea
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          color="40"
          style={{
            width: "42rem",
            height: "10rem",
          }}
          placeholder={`Start writing here, ${firstName}!`}
        />

        <button className="close--btn" onClick={() => setIsPostBoxOpen(false)}>
          x
        </button>

        <button onClick={handlePost} className="post--btn">
          Post
        </button>
        <img src={profileImg} className="postbox--profile" alt="" />
        <div className="select--image">
          {imgContent && preview && (
            <div className="previewImg--div">
              <i
                class="fa-sharp fa-regular fa-circle-xmark"
                id="close--icon"
                onClick={handlePrevImgCloseClick}
              ></i>
              <img
                src={preview}
                alt=""
                style={{ width: "4rem", height: "4rem" }}
                className="preview--img"
              />
            </div>
          )}
          <label htmlFor="file-input" className="img--select--label">
            <i
              class="fa-solid fa-image"
              // onClick={() => setIsPreviewImgOpen((prevState) => !prevState)}
            ></i>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="img--select"
            onChange={(e) =>
              setImgContent(URL.createObjectURL(e.target.files[0]))
            } // Set the selected image file to the state
          />
        </div>
      </div>
    </div>
  );
}

export default PostBox;
