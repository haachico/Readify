import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import SearchComponent from "./SearchComponent";

import { LoginProvider } from "..";

function Header() {
  // const { allUsers, setAllUsers } = useContext(LoginProvider);
  // const { setIsLogin, firstName, username, profileImg } =
  //   useContext(LoginProvider);

  return (
    <div className="header">
      {/* <img src={Logo} alt="logo" className="header--logo" /> */}
      <h1 style={{ marginLeft: "2rem" }}>
        <Link to="/">Readify</Link>
      </h1>
      <div className="header--nav">
        <SearchComponent />
      </div>
    </div>
  );
}

export default Header;
