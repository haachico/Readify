import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { LoginProvider } from "../useContext/LoginContext";

export default function Sidebar() {
  const { username, firstName, profileImg, loggedInUserDetails, setIsLogin } =
    useContext(LoginProvider);

  const handleLogoutClick = () => {
    setIsLogin(false);
  };

  return (
    <div className="sidebar--div">
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
  );
}
