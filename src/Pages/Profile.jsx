import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";

import { LoginProvider } from "..";
import Post from "../components/Post";

function Profile() {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isFollowersBoxOpen, setIsFollowersBoxOpen] = useState(false);
  const [isFollowingsBoxOpen, setIsFollowingsBoxOpen] = useState(false);

  const {
    encodedToken,
    username,
    allUsers,
    setAllUsers,
    followedUsers,
    setFollowedUsers,
    profileImg,
    setProfileImg,
    posts,
    setPosts,
    about,
    setAbout,
    link,
    setLink,
  } = useContext(LoginProvider);

  const [editedPost, setEditedPost] = useState("");
  const [editedImgContent, setEditedImgContent] = useState("");
  const [editedPostID, setEditedPostID] = useState("");
  const [imgContent, setImgContent] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editboxPreviewImg, setEditPreviewImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEdit = (id) => {
    const post = posts.find((e) => e?._id == id);

    setEditedPost(post.content);
    setEditedImgContent(post.imgContent);
    setEditedPostID(post?._id);
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

      console.log(result, "UPDATE EDIT POST RESULT");

      setPosts(result.posts);
      setEditedPostID("");
      setIsEditBoxOpen(false);
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

  const { profileName } = useParams();

  const selectedUser = allUsers?.find((user) => user.username === profileName);

  console.log(selectedUser, "Selected user");

  const handleSaveEditForm = async (id) => {
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
      setAllUsers(
        allUsers.map((user) =>
          user.username === result.user.username ? result.user : user
        )
      );

      const postResponse = await fetch(`/api/posts/edit/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({
          postData: {
            image: profileImg,
          },
        }),
      });
      const postResult = await postResponse.json();
      setPosts(postResult.posts);
      setEditedPostID("");
      // setIsEditBoxOpen(false);

      setIsEditFormOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowClick = async (id) => {
    try {
      const response = await fetch(`/api/users/follow/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result, "follow fn called result");
      setFollowedUsers([...followedUsers, result]);

      const updatedAllUsers = allUsers.map((e) =>
        e.username === result.followUser.username
          ? result.followUser
          : e.username === result.user.username
          ? result.user
          : e
      );

      setAllUsers(updatedAllUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollowClick = async (id) => {
    try {
      const response = await fetch(`/api/users/unfollow/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      //ALL USERS NOT GETTING UPDATED //////////
      const result = await response.json();
      console.log(result, "UNFOLLOW RESULT");

      setFollowedUsers(
        followedUsers.filter(
          (e) => e.followUser.username !== result.followUser.username
        )
      );
      const updatedAllUsers = allUsers.map((e) =>
        e.username === result.followUser.username
          ? result.followUser
          : e.username === result.user.username
          ? result.user
          : e
      );

      console.log(updatedAllUsers, "UPDATED ALL USERS");
      setAllUsers(updatedAllUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const sortedPosts = posts?.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return dateB - dateA;
  });

  const postUpdateProfileId = posts.find(
    (e) => e.username === selectedUser.username
  )._id;

  return (
    <div>
      {isLoading ? (
        <FadeLoader
          color={"#f5f5f5"}
          loading={isLoading}
          size={300}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div>
          <div className="profile--div">
            <div className="profile--dp">
              <img
                src={selectedUser?.image}
                alt=""
                style={{ width: "8rem", height: "8rem", borderRadius: "50%" }}
              />

              {selectedUser.username !== username ? (
                followedUsers
                  .map((e) => e.followUser.username === selectedUser.username)
                  .includes(true) ? (
                  <button
                    onClick={() => handleUnfollowClick(selectedUser._id)}
                    className="profileUnfollow--btn"
                  >
                    Following
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollowClick(selectedUser._id)}
                    className="profileFollow--btn"
                  >
                    Follow
                  </button>
                )
              ) : (
                ""
              )}
            </div>
            {
              <div>
                <h2 style={{ margin: "0px" }}>
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </h2>
                <p>@{selectedUser?.username}</p>
                <p>About : {selectedUser.about}</p>
                <p>
                  Link :{" "}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "rgba(0,184,255)" }}
                  >
                    {selectedUser.link}
                  </a>
                </p>

                <div className="profile--btns">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ margin: "2px" }}>
                      {selectedUser.following.length}
                    </p>
                    <button
                      style={{ margin: "2px" }}
                      onClick={() => setIsFollowingsBoxOpen(true)}
                    >
                      Following
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ margin: "2px" }}>
                      {selectedUser.followers.length}
                    </p>
                    <button
                      style={{ margin: "2px" }}
                      onClick={() => setIsFollowersBoxOpen(true)}
                    >
                      Followers
                    </button>
                  </div>
                </div>
                <div>
                  {isFollowersBoxOpen && (
                    <div className="followers--box">
                      <button
                        onClick={() => setIsFollowersBoxOpen(false)}
                        className="followersBox--close"
                      >
                        x
                      </button>
                      {selectedUser?.followers?.map((user) => (
                        <div>
                          <div className="follower--box">
                            <Link to={`/profile/${user.username}`}>
                              {" "}
                              <img
                                src={user.image}
                                alt={user.username}
                                style={{
                                  width: "2rem",
                                  height: "2rem",
                                  borderRadius: "50%",
                                }}
                              />
                            </Link>
                            <Link to={`/profile/${user.username}`}>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "5px",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  <p style={{ marginBottom: "0px" }}>
                                    {user.firstName}
                                  </p>
                                  <p style={{ marginBottom: "0px" }}>
                                    {user.lastName}
                                  </p>
                                </div>
                                <p
                                  style={{ fontSize: "10px", marginTop: "2px" }}
                                >
                                  @{user.username}
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}{" "}
                    </div>
                  )}
                  {isFollowingsBoxOpen && (
                    <div className="followings--box">
                      <button
                        onClick={() => setIsFollowingsBoxOpen(false)}
                        className="followingsBox--close"
                      >
                        x
                      </button>
                      {selectedUser?.following?.map((user) => (
                        <div>
                          <div className="following--box">
                            <Link to={`/profile/${user.username}`}>
                              {" "}
                              <img
                                src={user.image}
                                alt={user.username}
                                style={{
                                  width: "2rem",
                                  height: "2rem",
                                  borderRadius: "50%",
                                }}
                              />
                            </Link>
                            <Link to={`/profile/${user.username}`}>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "5px",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  <p style={{ marginBottom: "0px" }}>
                                    {user.firstName}
                                  </p>
                                  <p style={{ marginBottom: "0px" }}>
                                    {user.lastName}
                                  </p>
                                </div>
                                <p
                                  style={{ fontSize: "10px", marginTop: "2px" }}
                                >
                                  @{user.username}
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}{" "}
                    </div>
                  )}
                </div>
              </div>
            }

            {/* EDIT  SECTION*/}
            {selectedUser.username === username ? (
              <div>
                <button
                  onClick={() => setIsEditFormOpen(true)}
                  className="editProfile--btn"
                >
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
                <button
                  onClick={() => handleSaveEditForm(postUpdateProfileId)}
                  className="btn"
                >
                  Save
                </button>
              </form>
            )}
          </div>
          <div className="posts--div">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((e) =>
                e && e?.username === profileName ? (
                  <Post
                    postId={e._id}
                    postUsername={e.username}
                    image={e.image}
                    firstName={e.firstName}
                    lastName={e.lastName}
                    content={e.content}
                    imgContent={e.imgContent}
                    likesCount={e.likes.likeCount}
                    createdAt={e.createdAt}
                    editedPostID={editedPostID}
                    isEditBoxOpen={isEditBoxOpen}
                    setIsEditBoxOpen={setIsEditBoxOpen}
                    editedPost={editedPost}
                    setEditedPost={setEditedPost}
                    editboxPreviewImg={editboxPreviewImg}
                    setEditPreviewImg={setEditPreviewImg}
                    setEditedImgContent={setEditedImgContent}
                    handleEdit={handleEdit}
                    handleUpdate={handleUpdate}
                  />
                ) : null
              )
            ) : (
              <h3>No post yet</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
