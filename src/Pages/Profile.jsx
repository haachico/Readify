import React from "react";
import { useContext } from "react";
import { useParams } from "react-router";
import { LoginProvider } from "..";

function Profile() {
  const { posts, allUsers } = useContext(LoginProvider);

  const { profileID } = useParams();

  const selectedUser =
    posts.find((user) => user._id == profileID) ||
    allUsers.find((user) => user._id == profileID);

  console.log(posts, "POSTS");
  console.log(selectedUser, "Selected user");
  console.log(profileID);
  return (
    <div>
      <div>
        <img
          src={selectedUser.image}
          alt=""
          style={{ width: "8rem", height: "8rem", borderRadius: "50%" }}
        />
      </div>
      <div>
        <h2>
          {selectedUser?.firstName} {selectedUser.lastName}
        </h2>
        <p>@{selectedUser?.username}</p>
        <p>Bio</p>
        <div>
          ``
          {/* <p>Followers: {selectedUser.followers.length}</p> */}
          {/* <p>Following: {selectedUser.following.length}</p> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
