import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { LoginProvider } from "../useContext/LoginContext";
import { API_BASE_URL } from "../utils/api";

function SuggestedUsers() {
  const {
    encodedToken,
    allUsers,
    setAllUsers,
    username,
    followedUsers,
    setFollowedUsers,
    userID,
  } = useContext(LoginProvider);

  const handleFollow = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({ followingId: id }),
      });
      const result = await response.json();
      console.log(result, "followers result");
      
      // Update followedUsers in context so the card disappears
      const user = allUsers.find(u => u.id === id);
      if (user) {
        setFollowedUsers([...followedUsers, { followUser: user }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  return (
    <div className="suggestedUsers--div">
      {/* SUGGESTED USERS---DIV */}
      <div className="suggestedUser--div">
        <h2>Suggested users</h2>
        {allUsers
          .filter((e) => e.username !== username)
          .map((user) => (
            <div key={user.id}>
              {/* if the followed user ID is in followedUsers array, hide; else show */}
              {followedUsers.includes(user.id) ? (
                ""
              ) : (
                <div className="user">
                  <Link to={`/profile/${user.username}`}>
                    {" "}
                    <img src={user.profileImage} alt={user.username} />
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
                        <p style={{ marginBottom: "0px" }}>{user.firstName}</p>
                        <p style={{ marginBottom: "0px" }}>{user.lastName}</p>
                      </div>
                      <p style={{ fontSize: "10px", marginTop: "2px" }}>
                        @{user.username}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleFollow(user.id)}
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
  );
}

export default SuggestedUsers;
