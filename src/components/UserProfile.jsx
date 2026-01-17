import React from "react";

import { useContext } from "react";
import { LoginProvider } from "../useContext/LoginContext";
import { Link } from "react-router-dom";
import AvatarSelection from "./AvatarSelection";

function UserProfile({
  userId,
  firstName,
  lastName,
  image,
  userName,
  aboutUser,
  setAbout,
  bioLink,
  setLink,
  followings,
  followers,
  postUpdateProfileId,
  handleFollowClick,
  handleUnfollowClick,
  handleSaveEditForm,
  isFollowersBoxOpen,
  setIsFollowersBoxOpen,
  isFollowingsBoxOpen,
  setIsFollowingsBoxOpen,
  isEditFormOpen,
  setIsEditFormOpen,
  profileImg,
  setProfileImg,
}) {
  const { link, about, username, followedUsers } = useContext(LoginProvider);

  return (
    <div>
      <div className="profile--div">
        <div className="profile--dp">
          <img
            src={image}
            alt=""
            style={{ width: "8rem", height: "8rem", borderRadius: "50%" }}
          />

          {userName !== username ? (
            followedUsers.includes(userId) ? (
              <button
                onClick={() => handleUnfollowClick(userId)}
                className="profileUnfollow--btn"
              >
                Following
              </button>
            ) : (
              <button
                onClick={() => handleFollowClick(userId)}
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
              {firstName} {lastName}
            </h2>
            <p>
              <strong>Username : </strong> @{userName}
            </p>
            <p>
              {" "}
              <strong>About : </strong> {aboutUser}
            </p>
            <p>
              <strong>Link : </strong>{" "}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(0,184,255)" }}
              >
                {bioLink}
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
                <p style={{ margin: "2px" }}>{followings || 0}</p>
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
                <p style={{ margin: "2px" }}>{followers || 0}</p>
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
                  {followers?.map((user) => (
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
                            <p style={{ fontSize: "10px", marginTop: "2px" }}>
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
                  {followings?.map((user) => (
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
                            <p style={{ fontSize: "10px", marginTop: "2px" }}>
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
        {userName === username && (
          <div>
            <button
              onClick={() => setIsEditFormOpen(true)}
              className="editProfile--btn"
            >
              Edit profile
            </button>
          </div>
        )}

        {isEditFormOpen && (
          <form className="edit--form" onSubmit={(e) => e.preventDefault()}>
            {userName === username ? (
              <div className="profileImg--div">
                <label htmlFor="dp" className="profile--camera">
                  Upload :{" "}
                  <span>
                    {profileImg ? (
                      <div className="preview--dp">
                        <img
                          src={profileImg}
                          alt="profileImg"
                          style={{
                            marginLeft: "2px",
                            width: "3rem",
                            height: "3rem",
                            borderRadius: "50%",
                          }}
                        />
                        <span className="upload--arrow">
                          {" "}
                          <i class="fa-solid fa-circle-chevron-up"></i>
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
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

                <AvatarSelection setProfileImg={setProfileImg} />
              </div>
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
    </div>
  );
}

export default UserProfile;
