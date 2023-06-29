import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import SearchComponent from "./SearchComponent";

import { LoginProvider } from "..";

function Header() {
  const [searchText, setSearchText] = useState("");
  const { allUsers, setAllUsers } = useContext(LoginProvider);
  // const { setIsLogin, firstName, username, profileImg } =
  //   useContext(LoginProvider);

  const filteredUser = [...allUsers].filter((e) =>
    e.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="header">
      {/* <img src={Logo} alt="logo" className="header--logo" /> */}
      <h1 style={{ marginLeft: "2rem" }}>
        <Link to="/">Readify</Link>
      </h1>
      <div className="header--nav">
        <SearchComponent
          searchText={searchText}
          setSearchText={setSearchText}
        />
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
      </div>
    </div>
  );
}

export default Header;
