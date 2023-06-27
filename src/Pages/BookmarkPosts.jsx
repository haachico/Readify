import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { LoginProvider } from "..";

function BookmarkPost() {
  const {
    firstName,
    lastName,
    email,
    encodedToken,
    username,
    userID,
    bookmarkPosts,
    setBookmarkPosts,
    likedPosts,
    dislikedPosts,
    setLikedPosts,
    setDislikedPosts,
    allUsers,
    setAllUsers,
    followedUsers,
    setFollowedUsers,
    isPostboxOpen,
    setIsPostBoxOpen,
    profileImg,
    setProfileImg,
    setIsLogin,
    loggedInUserDetails,
    setLoggedInUserDetails,
    posts,
    setPosts,
  } = useContext(LoginProvider);
  const [content, setContent] = useState("");

  const [editedPost, setEditedPost] = useState("");
  const [editedImgContent, setEditedImgContent] = useState("");
  const [editedPostID, setEditedPostID] = useState("");
  const [imgContent, setImgContent] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editboxPreviewImg, setEditPreviewImg] = useState(null);

  console.log(allUsers, "ALL USERS");
  console.log(posts, "POSTSS");
  const handleEdit = (id) => {
    const post = posts.find((e) => e._id == id);

    setEditedPost(post.content);
    setEditedImgContent(post.imgContent);
    setEditedPostID(post._id);
    setIsEditBoxOpen((prevState) => !prevState);
  };

  console.log(followedUsers, "FOLLOWED USERS");
  console.log(loggedInUserDetails, "LOGGED IN USER DETAILS");

  const handleUpdate = async (id) => {
    // /api/posts/edit/:postId
    try {
      const response = await fetch(`api/posts/edit/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({
          postData: {
            content: editedPost,
            imgContent: editedImgContent,
          },
        }),
      });

      const result = await response.json();
      setPosts(result.posts);
      setEditedPostID("");
      setIsEditBoxOpen((prevState) => !prevState);
      // setEditedPost("");
    } catch (err) {
      console.error(err);
    }
  };

  console.log(imgContent, "IMAGE CONTENt");
  const handlePost = async () => {
    if (!content) return;
    try {
      console.log(encodedToken, "ENCODED TOKEN");
      const response = await fetch("/api/posts", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({
          postData: {
            content: content,
            imgContent: imgContent,
            image: profileImg,
            firstName: firstName,
            lastName: lastName,
          },
        }),
      });

      const result = await response.json();
      console.log("Success:", result);
      setPosts(result.posts);
      setContent("");
      setIsPostBoxOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getPosts = async () => {
    try {
      const response = await fetch("/api/posts", {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();

      setPosts(result.posts);
    } catch (err) {
      console.error(err);
    }
  };

  const getUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "GET", // or 'PUT'
      });

      const result = await response.json();

      setAllUsers(result.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPosts();
    getUsers();
  }, []);

  const handleLike = async (id) => {
    try {
      const response = await fetch(`/api/posts/like/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      setPosts(result.posts);
      setLikedPosts([...likedPosts, posts.find((e) => e._id === id)]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (id) => {
    try {
      const response = await fetch(`/api/posts/dislike/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result);
      setPosts(result.posts);
      setLikedPosts(likedPosts.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result);
      setPosts(result.posts);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async (id) => {
    try {
      const response = await fetch(`/api/users/bookmark/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result);
      setBookmarkPosts(result.bookmarks);
    } catch (err) {
      console.error(err);
    }
  };
  const sortedPosts = posts
    .filter((post) =>
      bookmarkPosts.some((bookmark) => bookmark.username === post.username)
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return dateB - dateA;
    });

  console.log(sortedPosts, " SORTED POST");

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

  console.log(bookmarkPosts, "BOOKMARK POSTS");

  useEffect(() => {
    if (!imgContent) {
      setPreview(undefined);

      return;
    }

    // const objectUrl = URL.createObjectURL(imgContent);
    setPreview(imgContent);

    // free memory when ever this component is unmounted
    // return () => URL.revokeObjectURL(objectUrl);
  }, [imgContent]);

  useEffect(() => {
    if (!editedImgContent) {
      setEditPreviewImg(undefined);
    }
    setEditPreviewImg(editedImgContent);
  }, [editedImgContent]);

  console.log(editboxPreviewImg, "EDIT prev");
  console.log(imgContent, "IMG");

  const handlePrevImgCloseClick = () => {
    setPreview(null);
    setImgContent(null);
  };

  console.log(posts, "POSTSSSSSSSSS");
  return (
    <div>
      <div className="posts--div">
        <div
          className="post--div"
          onClick={() => setIsPostBoxOpen((prevState) => !prevState)}
        >
          <img
            src={profileImg}
            alt=""
            style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
          />
          <div>What is in your mind, {firstName}?</div>
        </div>

        {isPostboxOpen && (
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
              placeholder={`What is in your mind, ${firstName}?`}
            />

            <button
              className="close--btn"
              onClick={() => setIsPostBoxOpen(false)}
            >
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
        )}
        <div>
          {sortedPosts.map((post) => (
            <div className="post">
              <Link to={`/profile/${post.username}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <img
                    src={post.image}
                    alt={post.username}
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                    }}
                  />

                  <div>
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
                        {post.firstName}
                      </h4>{" "}
                      <h4 style={{ marginBottom: "0px" }}>{post.lastName}</h4>
                      <span>•</span>
                      <p
                        style={{
                          marginBottom: "2px",
                          marginTop: "0px",
                          fontSize: "12px",
                        }}
                      >
                        {getDate(post.createdAt)}
                      </p>
                    </div>
                    <div style={{ marginTop: "-5px" }}>
                      <p style={{ fontSize: "12px", marginTop: "5px" }}>
                        @{post.username}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              {post._id === editedPostID && isEditBoxOpen && (
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
                      setEditedImgContent(
                        URL.createObjectURL(e.target.files[0])
                      )
                    } // Set the selected image file to the state
                  />
                  <button
                    onClick={() => handleUpdate(post._id)}
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

              <p>{post.content}</p>
              {post.imgContent && (
                <img
                  src={post.imgContent}
                  alt=""
                  style={{ width: "100%", height: "25rem" }}
                />
              )}
              <p>Likes: {post.likes.likeCount}</p>

              {likedPosts.map((e) => e._id === post._id).includes(true) ? (
                <button
                  onClick={() => handleDislike(post._id)}
                  style={{ color: "blue" }}
                >
                  Like:
                </button>
              ) : (
                <button onClick={() => handleLike(post._id)}>Like </button>
              )}
              <button onClick={() => handleBookmark(post._id)}>Bookmark</button>
              {post.username === username && (
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              )}
              {post.username === username && (
                <button onClick={() => handleEdit(post._id)}>Edit</button>
              )}
              <hr className="break--line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookmarkPost;
