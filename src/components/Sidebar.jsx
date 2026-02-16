import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { LoginProvider } from "../useContext/LoginContext";
import { API_BASE_URL } from "../utils/api";

export default function Sidebar() {
  const {
    username,
    firstName,
    profileImg,
    loggedInUserDetails,
    refreshAccessToken,
    handleLogout
  } = useContext(LoginProvider);

  const handleLogoutClick = async () => {
    try {
      let token = localStorage.getItem('token');
      let response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
          });
        } else {
          handleLogout && handleLogout();
          return;
        }
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      handleLogout && handleLogout();
      // Redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
      handleLogout && handleLogout();
    }
  }
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
          alt="User avatar"
          className="header--profilePhoto"
        />
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
