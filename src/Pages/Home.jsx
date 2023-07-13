import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";

import { LoginProvider } from "..";

function Home() {
  const {
    firstName,
    lastName,
    encodedToken,
    username,
    bookmarkPosts,
    setBookmarkPosts,
    likedPosts,
    setLikedPosts,
    allUsers,
    setAllUsers,
    followedUsers,
    isPostboxOpen,
    setIsPostBoxOpen,
    profileImg,
    loggedInUserDetails,
    posts,
    setPosts,
    handleBookmark,
    handleRemoveBookmark,
    handleLike,
    handleDislike,
    handleDelete,
  } = useContext(LoginProvider);
  const [content, setContent] = useState("");

  const [editedPost, setEditedPost] = useState("");
  const [editedImgContent, setEditedImgContent] = useState("");
  const [editedPostID, setEditedPostID] = useState("");
  const [imgContent, setImgContent] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editboxPreviewImg, setEditPreviewImg] = useState(null);
  const [pressedButton, setPressedButton] = useState(null);
  const [sortOption, setSortOption] = useState("LATEST");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  console.log(allUsers, "ALL USERS");
  console.log(posts, "POSTSS");
  const handleEdit = (id) => {
    const post = posts.find((e) => e._id === id);

    setEditedPost(post.content);
    setEditedImgContent(post.imgContent);
    setEditedPostID(post._id);
    setIsEditBoxOpen(true);
  };

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

  // below in return while mapping if you see, we set posts. as default
  const handleSort = (option) => {
    // let sortedData = [...posts];
    if (option === "LATEST") {
      // sortedData.sort((a, b) => {
      //   const dateA = new Date(a.createdAt);
      //   const dateB = new Date(b.createdAt);

      //   return dateB - dateA;
      // });
      setSortOption(option);
      setPressedButton(option);
    } else if (option === "OLDEST") {
      // sortedData.sort((a, b) => {
      //   const dateA = new Date(a.createdAt);
      //   const dateB = new Date(b.createdAt);

      //   return dateA - dateB;
      // });
      setSortOption(option);
      setPressedButton(option);
    } else if (option === "TRENDING") {
      // sortedData.sort((a, b) => b.likes.likeCount - a.likes.likeCount);
      setSortOption(option);
      setPressedButton(option);
    }

    // setSortOption(option);
    // setPosts(sortedData);
  };

  const postsData =
    sortOption === "LATEST"
      ? [...posts].sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          return dateB - dateA;
        })
      : sortOption === "OLDEST"
      ? [...posts].sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          return dateA - dateB;
        })
      : sortOption === "TRENDING"
      ? [...posts].sort((a, b) => b.likes.likeCount - a.likes.likeCount)
      : "";

  // console.log(sortedPosts, " SORTED POST");
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

  console.log(pressedButton, "PRESSED BUTTOn");
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
      <h2 style={{ textAlign: "center" }}>Home</h2>
      {isLoading ? (
        <FadeLoader
          color={"#f5f5f5"}
          loading={isLoading}
          size={300}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          <div className="sort--btns">
            <button
              onClick={() => handleSort("LATEST")}
              // className={pressedButton === "LATEST" ? "highlight" : ""}
              style={{
                backgroundColor: pressedButton === "LATEST" ? "#cbd5e1" : "",
                color: pressedButton === "LATEST" ? "black" : "",
              }}
            >
              Latest
            </button>
            <button
              onClick={() => handleSort("OLDEST")}
              // className={pressedButton === "LATEST" ? "highlight" : ""}
              style={{
                backgroundColor: pressedButton === "OLDEST" ? "#cbd5e1" : "",
                color: pressedButton === "OLDEST" ? "black" : "",
              }}
            >
              Oldest
            </button>
            <button
              onClick={() => handleSort("TRENDING")}
              // className={pressedButton === "TRENDING" ? "highlight" : ""}
              style={{
                backgroundColor: pressedButton === "TRENDING" ? "#cbd5e1" : "",
                color: pressedButton === "TRENDING" ? "black" : "",
              }}
            >
              Trending
            </button>
          </div>

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
              {postsData.map(
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
                                style={{
                                  marginLeft: "auto",
                                  cursor: "pointer",
                                }}
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
                    </div>
                  )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
