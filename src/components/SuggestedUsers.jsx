import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { LoginProvider } from "../useContext/LoginContext";

function SuggestedUsers() {
  const {
    encodedToken,
    allUsers,
    setAllUsers,
    username,
    followedUsers,
    setFollowedUsers,
  } = useContext(LoginProvider);

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
      // setUpdatedFollowings(result);

      const updatedAllUsers = allUsers.map((e) =>
        e.username === result.followUser.username
          ? result.followUser
          : e.username === result.user.username
          ? result.user
          : e
      );

      console.log(updatedAllUsers, "UPDATED ALL USERS");
      setAllUsers(updatedAllUsers);
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
            <div>
              {/* if the followed user username (in followedUsersArray) is equal to LOGGED IN user username then show nothing, else  show the user */}
              {followedUsers
                .map((e) => e.followUser.username)
                .includes(user.username) ? (
                ""
              ) : (
                <div className="user">
                  <Link to={`/profile/${user.username}`}>
                    {" "}
                    <img src={user.image} alt={user.username} />
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
                    onClick={() => handleFollow(user._id)}
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
