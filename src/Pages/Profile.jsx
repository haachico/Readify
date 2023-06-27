import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { LoginProvider } from "..";

function Profile() {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

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
    posts,
    setPosts,
    loggedInUserDetails,
    setLoggedInUserDetails,
    about,
    setAbout,
    link,
    setLink,
  } = useContext(LoginProvider);
  const [changedProfileImg, setChangedProfileImg] = useState(profileImg);
  // const [changedAbout, setChangedAbout] = useState(about);
  // const [changedLink, setChangedLink] = useState(link);
  // const [content, setContent] = useState("");

  const [editedPost, setEditedPost] = useState("");
  const [editedImgContent, setEditedImgContent] = useState("");
  const [editedPostID, setEditedPostID] = useState("");
  const [imgContent, setImgContent] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editboxPreviewImg, setEditPreviewImg] = useState(null);
  const [newUserData, setNewUserData] = useState({});

  const handleEdit = (id) => {
    const post = posts.find((e) => e._id == id);

    setEditedPost(post.content);
    setEditedImgContent(post.imgContent);
    setEditedPostID(post._id);
    setIsEditBoxOpen((prevState) => !prevState);
  };

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

      setBookmarkPosts(result.bookmarks);
    } catch (err) {
      console.error(err);
    }
  };

  // const handleFollow = async (id) => {
  //   try {
  //     const response = await fetch(`/api/users/follow/${id}`, {
  //       method: "POST", // or 'PUT'
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: encodedToken,
  //       },
  //     });

  //     const result = await response.json();
  //     console.log(result, "followers result");
  //     setFollowedUsers([...followedUsers, result]);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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

  const handlePrevImgCloseClick = () => {
    setPreview(null);
    setImgContent(null);
  };

  const { profileName } = useParams();

  const selectedUser = allUsers.find((user) => user.username === profileName);

  console.log(selectedUser, "Selected user");

  const handleSaveEditForm = async (e) => {
    console.log("SUBMITEDDDD");

    try {
      const response = await fetch(`/api/users/edit`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({
          userData: {
            image: profileImg,
            about: about,
            link: link,
          },
        }),
      });

      const result = await response.json();

      console.log(result, " USER RESPONSE RESULT");
      // setNewUserData(result.user);
      setAllUsers(
        allUsers.map((user) =>
          user.username === result.user.username ? result.user : user
        )
      );

      setPosts(
        posts.map((post) =>
          post.username === result.user.username
            ? { ...post, image: result.user.image }
            : post
        )
      );
      setIsEditFormOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return dateB - dateA;
  });

  console.log(allUsers, "NEW ALL USERS");
  console.log(posts, "POSTS");

  return (
    <div>
      <div className="profile--div">
        <div className="profile--dp">
          <img
            src={selectedUser?.image}
            alt=""
            style={{ width: "8rem", height: "8rem", borderRadius: "50%" }}
          />
        </div>
        {
          <div>
            <h2 style={{ margin: "0px" }}>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </h2>
            <p>@{selectedUser?.username}</p>
            <p>About : {selectedUser.about}</p>
            <p>Link : {selectedUser.link}</p>

            <div style={{ display: "flex", gap: "1rem" }}>
              <p>Followers: 0</p>
              <p>Following :0</p>
            </div>
          </div>
        }
        {selectedUser.username === username ? (
          <div>
            <button onClick={() => setIsEditFormOpen(true)}>
              Edit profile
            </button>
          </div>
        ) : (
          ""
        )}

        {isEditFormOpen && (
          <form className="edit--form" onSubmit={(e) => e.preventDefault()}>
            {selectedUser.username === username ? (
              <>
                <label htmlFor="dp" className="profile--camera">
                  Select :{" "}
                  <span>
                    <i class="fa-solid fa-camera"></i>
                  </span>
                </label>
                <input
                  id="dp"
                  type="file"
                  accept="image/*"
                  className="img--select"
                  onChange={(e) =>
                    setProfileImg(URL.createObjectURL(e.target.files[0]))
                  } // Set the selected image file to the state
                />
              </>
            ) : (
              ""
            )}
            <label>
              About :
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>
            <label>
              Link :
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
            <button onClick={handleSaveEditForm}>Save</button>
          </form>
        )}
      </div>
      <div className="posts--div">
        {sortedPosts.map((e) =>
          e?.username === selectedUser?.username ? (
            <div className="post">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "1rem",
                }}
              >
                <img
                  src={e?.image}
                  alt={e?.username}
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
                    <h4 style={{ marginBottom: "0px" }}>{e?.firstName}</h4>{" "}
                    <h4 style={{ marginBottom: "0px" }}>{e?.lastName}</h4>
                    <span>•</span>
                    <p
                      style={{
                        marginBottom: "2px",
                        marginTop: "0px",
                        fontSize: "12px",
                      }}
                    >
                      {getDate(e?.createdAt)}
                    </p>
                  </div>
                  <div style={{ marginTop: "-5px" }}>
                    <p style={{ fontSize: "12px", marginTop: "5px" }}>
                      @{e?.username}
                    </p>
                  </div>
                </div>
              </div>

              {e?._id === editedPostID && isEditBoxOpen && (
                <div className="editBox--div">
                  <textarea
                    rows={4}
                    column={40}
                    type="text"
                    value={editedPost}
                    onChange={(e) => setEditedPost(e?.target.value)}
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
                    onClick={() => handleUpdate(e?._id)}
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

              <p>{e?.content}</p>
              {e?.imgContent && (
                <img
                  src={e?.imgContent}
                  alt=""
                  style={{ width: "100%", height: "25rem" }}
                />
              )}
              <p>Likes: {e?.likes.likeCount}</p>

              {likedPosts.map((e) => e?._id === e?._id).includes(true) ? (
                <button
                  onClick={() => handleDislike(e?._id)}
                  style={{ color: "blue" }}
                >
                  Like:
                </button>
              ) : (
                <button onClick={() => handleLike(e?._id)}>Like </button>
              )}
              <button onClick={() => handleBookmark(e?._id)}>Bookmark</button>
              {e.username === username && (
                <button onClick={() => handleDelete(e?._id)}>Delete</button>
              )}
              {e.username === username && (
                <button onClick={() => handleEdit(e?._id)}>Edit</button>
              )}
              <hr className="break--line" />
            </div>
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );
}

export default Profile;
