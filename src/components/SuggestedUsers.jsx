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
      setFollowedUsers([...followedUsers, id]);
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
                <div className="user" style={{
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1rem",
  width: "100%",
  boxSizing: "border-box"
}}>
  <Link to={`/profile/${user.username}`} style={{
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flex: 1,
    textDecoration: "none",
    color: "inherit",
    minWidth: 0
  }}>
    <img 
      src={user.profileImage} 
      alt={user.username} 
      style={{
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #00b8ff",
        flexShrink: 0
      }}
    />
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      flex: 1,
      minWidth: 0 
    }}>
      <div style={{
        display: "flex",
        gap: "5px",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        marginBottom: "0.25rem",
        width: "100%"
      }}>
        <p style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {user.firstName}
        </p>
        <p style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {user.lastName}
        </p>
      </div>
      <p style={{ 
        fontSize: "10px", 
        margin: 0, 
        color: "#94a3b8",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%"
      }}>
        @{user.username}
      </p>
    </div>
  </Link>
  <button
    onClick={() => handleFollow(user.id)}
    className="btn"
    style={{
      flexShrink: 0,
      whiteSpace: "nowrap"
    }}
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
