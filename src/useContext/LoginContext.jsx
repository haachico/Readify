import React from "react";
import { useState } from "react";

import { createContext } from "react";

export const LoginProvider = createContext();

export function LoginContext({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [encodedToken, setEncodedToken] = useState("");
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");
  const [bookmarkPosts, setBookmarkPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [dislikePosts, setDislikePosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [isPostboxOpen, setIsPostBoxOpen] = useState(false);
  const [profileImg, setProfileImg] = useState(
    "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
  );

  return (
    <div>
      <LoginProvider.Provider
        value={{
          isLogin,
          setIsLogin,
          firstName,
          setFirstName,
          lastName,
          setLastName,
          email,
          setEmail,
          encodedToken,
          setEncodedToken,
          username,
          setUsername,
          userID,
          bookmarkPosts,
          setBookmarkPosts,
          likedPosts,
          setLikedPosts,
          dislikePosts,
          setDislikePosts,
          allUsers,
          setAllUsers,
          followedUsers,
          setFollowedUsers,
          isPostboxOpen,
          setIsPostBoxOpen,
          profileImg,
          setProfileImg,
        }}
      >
        {children}
      </LoginProvider.Provider>
    </div>
  );
}

export default LoginContext;
