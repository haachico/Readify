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

  return (
    <div className="main--body">
      {/* <Link to="/" style={{ margin: "0 8rem" }}>
        Latest
      </Link>
      <span>|</span>
      <Link to="/trending" style={{ margin: "0 10rem" }}>
        Trending
      </Link> */}
      <div className="empty--div">
        <Link to="/">Home</Link>
        <Link to="trending">Trending</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/bookmark">Bookmark</Link>
        <Link to="/" onClick={handleLogoutClick}>
          Logout
        </Link>
        <div className="header--profile">
          {/* <span>|</span> */}
          <img
            src={profileImg}
            alt={firstName}
            className="header--profilePhoto"
          />
          {/* )} */}
          <h4>{firstName}</h4>
        </div>
      </div>
      <Outlet />
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
                  <Link to={`/profile/${user._id}`}>
                    {" "}
                    <img src={user.image} alt={user.username} />
                  </Link>
                  <Link to={`/profile/${user._id}`}>
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

                  <button onClick={() => handleFollow(user._id)}>Follow</button>
                </div>
              )}{" "}
            </div>
          ))}
      </div>
    </div>
  );
}

export default HomeLayout;
