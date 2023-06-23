import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { LoginProvider } from "..";
import Nilesh from "../Assets/Nilesh.jpg";
import Logo from "../Assets/readify.png";

function Header() {
  const { setIsLogin, firstName, username, profileImg } =
    useContext(LoginProvider);

  return (
    <div className="header">
      {/* <img src={Logo} alt="logo" className="header--logo" /> */}
      <h1>
        <Link to="/">Readify</Link>
      </h1>
      <div className="header--nav"></div>
    </div>
  );
}

export default Header;
