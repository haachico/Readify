import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { LoginProvider } from "..";
import Nilesh from "../Assets/Nilesh.jpg";
import Logo from "../Assets/readify.png";

function Header() {
  const { setIsLogin, firstName, username, profileImg } =
    useContext(LoginProvider);
  const handleLogoutClick = () => {
    setIsLogin(false);
  };
  return (
    <div className="header">
      {/* <img src={Logo} alt="logo" className="header--logo" /> */}
      <h1>Readify</h1>
      <div className="header--nav">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/bookmark">Bookmark</Link>
        <Link to="/" onClick={handleLogoutClick}>
          Logout
        </Link>
        <div className="header--profile">
          <span>|</span>
          {/* {username === "haachico" ? (
            <img
              src={Nilesh}
              alt={firstName}
              className="header--profilePhoto"
            />
          ) : ( */}
          <img
            src={profileImg}
            alt={firstName}
            className="header--profilePhoto"
          />
          {/* )} */}
          <h4>{firstName}</h4>
        </div>
      </div>
    </div>
  );
}

export default Header;
