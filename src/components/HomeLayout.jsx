import React, { useContext } from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

import { LoginProvider } from "..";

function HomeLayout() {
  const {
    firstName,

    encodedToken,
    username,

    allUsers,

    followedUsers,
    setFollowedUsers,

    profileImg,

    setIsLogin,
    posts,
    loggedInUserDetails,
    searchText,
    setSearchText,
  } = useContext(LoginProvider);

  const handleLogoutClick = () => {
    setIsLogin(false);
  };

  const handleFollow = async (id) => {
    try {
      const response = await fetch(`/api/users/follow/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result, "followers result");
      setFollowedUsers([...followedUsers, result]);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUser = [...allUsers].filter((e) =>
    e.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="main--body">
      <div className="empty--div">
        <Link to="/">
          <span>
            <i class="fa-solid fa-house"></i>
          </span>
          Home
        </Link>
        <Link to="trending">
          <span>
            <i class="fa-solid fa-arrow-trend-up"></i>
          </span>
          Trending
        </Link>
        <Link to="/explore">
          <span>
            <i class="fa-regular fa-compass"></i>
          </span>
          Explore
        </Link>
        <Link to="/bookmark">
          <span>
            <i class="fa-regular fa-bookmark"></i>
          </span>
          Bookmark
        </Link>
        <Link to="/" onClick={handleLogoutClick}>
          <span>
            <i class="fa-solid fa-right-from-bracket"></i>
          </span>
          Logout
        </Link>

        {/* <span>|</span> */}

        <div className="header--profile">
          <img
            src={profileImg}
            alt={loggedInUserDetails.firstName}
            className="header--profilePhoto"
          />
          {/* )} */}
          <div>
            <Link to={`/profile/${username}`}>
              <h4 style={{ margin: "2px" }}>{firstName}</h4>
              <p style={{ fontSize: "0.8rem", margin: "2px" }}>@{username}</p>
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
      <div>
        <div className="search--list">
          {searchText &&
            filteredUser.map((user) => (
              <div className="search--user">
                <Link
                  to={`/profile/${user.username}`}
                  onClick={() => setSearchText("")}
                >
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
                <Link
                  to={`/profile/${user.username}`}
                  onClick={() => setSearchText("")}
                >
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
                      <p style={{ marginBottom: "0px" }}>{user.firstName}</p>
                      <p style={{ marginBottom: "0px" }}>{user.lastName}</p>
                    </div>
                    <p style={{ fontSize: "10px", marginTop: "2px" }}>
                      @{user.username}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
        </div>
        <div className="suggestedUsers--div">
          <h2>Suggested users</h2>
          {allUsers
            .filter((e) => e.username !== username)
            .map((user) => (
              <div>
                {/* if the followed user username is equal to current user username then show nothing else show user */}
                {followedUsers
                  .map((e) => e.followUser.username)
                  .includes(user.username) ? (
                  ""
                ) : (
                  <div className="user">
                    <Link to={`/profile/${user.username}`}>
                      {" "}
                      <img src={user.image} alt={user.username} />
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
                          <p style={{ marginBottom: "0px" }}>{user.lastName}</p>
                        </div>
                        <p style={{ fontSize: "10px", marginTop: "2px" }}>
                          @{user.username}
                        </p>
                      </div>
                    </Link>

                    <button
                      onClick={() => handleFollow(user._id)}
                      className="btn"
                    >
                      Follow
                    </button>
                  </div>
                )}{" "}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default HomeLayout;
