import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { LoginProvider } from "..";

function Home() {
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
    setIsEditBoxOpen(true);
  };

  console.log(followedUsers, "FOLLOWED USERS");
  console.log(loggedInUserDetails, "LOGGED IN USER DETAILS");

  const handleUpdate = async (id) => {
    // /api/posts/edit/:postId
    try {
      const response = await fetch(`/api/posts/edit/${id}`, {
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
      setIsEditBoxOpen(false);

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
      setBookmarkPosts((prevState) => [...prevState, ...result.bookmarks]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      const response = await fetch(`/api/users/remove-bookmark/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result, "REMOVE BOOKMARK RESULT");
      setBookmarkPosts(result.bookmarks);
    } catch (err) {
      console.error(err);
    }
  };

  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return dateB - dateA;
  });

  console.log(sortedPosts, " SORTED POST");
  console.log(allUsers, "ALL USERS IN HOME");

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
  console.log(allUsers, "ALL USERS");
  return (
    <div>
      <div className="posts--div">
        <h2 style={{ textAlign: "center" }}>Home</h2>
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
              placeholder={`Start writing here, ${firstName}!`}
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
          {sortedPosts.map(
            (post) =>
              // Those we have followed, that is those in the followedUsers array, we check if any of the usernames in the folllowedUser array contains the username of the post OR if the post's username is equal to loggedin user's username then only show the post. In short, we ensuring that only the posts of those we FOLLOW as welll as the logged in user's posts should appear.
              (followedUsers
                .map((e) => e.followUser?.username)
                .includes(post.username) ||
                post.username === username) && (
                <div className="post">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <Link to={`/profile/${post.username}`}>
                      <img
                        src={post.image}
                        alt={post.username}
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
                          <Link
                            to={`/profile/${post.username}`}
                            style={{ height: "" }}
                          >
                            {post.firstName}
                          </Link>
                        </h4>{" "}
                        <h4 style={{ marginBottom: "0px" }}>
                          <Link to={`/profile/${post.username}`}>
                            {post.lastName}
                          </Link>
                        </h4>
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
                        {post.username === username && (
                          <span
                            style={{ marginLeft: "auto", cursor: "pointer" }}
                          >
                            <i
                              class="fa-solid fa-pen-to-square"
                              onClick={() => handleEdit(post._id)}
                            ></i>
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: "-5px" }}>
                        <p style={{ fontSize: "12px", marginTop: "5px" }}>
                          @{post.username}
                        </p>
                      </div>
                    </div>
                  </div>

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
                        <i
                          class="fa-solid fa-image"
                          id="editbox-image-icon"
                        ></i>{" "}
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
                  <div style={{ margin: "2rem 0" }}>
                    <p>{post.content}</p>
                  </div>
                  {post.imgContent && (
                    <img
                      src={post.imgContent}
                      alt=""
                      style={{ width: "100%", height: "25rem" }}
                    />
                  )}

                  <div className="post--btns">
                    <div>
                      {likedPosts
                        .map((e) => e._id === post._id)
                        .includes(true) ? (
                        <span onClick={() => handleDislike(post._id)}>
                          <i class="fa-solid fa-heart"></i>
                        </span>
                      ) : (
                        <span onClick={() => handleLike(post._id)}>
                          <i class="fa-regular fa-heart"></i>
                        </span>
                      )}{" "}
                      {post.likes.likeCount}
                    </div>
                    <i class="fa-regular fa-comment"></i>

                    {bookmarkPosts
                      .map(
                        (e) =>
                          e.content === post.content ||
                          e.imgContent === post.imgContent
                      )
                      .includes(true) ? (
                      <span onClick={() => handleRemoveBookmark(post._id)}>
                        {" "}
                        <i class="fa-solid fa-bookmark"></i>
                      </span>
                    ) : (
                      <span onClick={() => handleBookmark(post._id)}>
                        <i class="fa-regular fa-bookmark"></i>
                      </span>
                    )}
                    {post.username === username && (
                      <span onClick={() => handleDelete(post._id)}>
                        <i class="fa-solid fa-trash-can"></i>
                      </span>
                    )}
                  </div>
                  <hr className="break--line" />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
