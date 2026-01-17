import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import SearchComponent from "./SearchComponent";

import { LoginProvider } from "..";
import { API_BASE_URL } from "../utils/api";

function Header() {
  const [searchText, setSearchText] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);
  const { allUsers, setAllUsers } = useContext(LoginProvider);

  const handleSearch = async (value) => {
    setSearchText(value);
    
    if (!value.trim()) {
      setFilteredUser([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/search?query=${value}`);
      const { users } = await response.json();
      setFilteredUser(users);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className="header">
      <h1 style={{ marginLeft: "2rem" }}>
        <Link to="/">Readify</Link>
      </h1>
      <div className="header--nav">
        <SearchComponent
          searchText={searchText}
          setSearchText={handleSearch}
        />

        {searchText && (
          <div className="search--list">
            {filteredUser.map((user) => (
              <div
                className="search--user"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "flex-start",
                }}
              >
                <Link
                  to={`/profile/${user.username}`}
                  onClick={() => setSearchText("")}
                >
                  {" "}
                  <img
                    src={user.profileImage}
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
            ))}{" "}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
