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
  const [posts, setPosts] = useState([]);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [profileImg, setProfileImg] = useState(
    "https://img.freepik.com/free-icon/user_318-159711.jpg"
  );
  const [about, setAbout] = useState("");
  const [link, setLink] = useState("");
  // const [searchText, setSearchText] = useState("");

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
          posts,
          setPosts,
          loggedInUserDetails,
          setLoggedInUserDetails,
          about,
          setAbout,
          link,
          setLink,
          // searchText,
          // setSearchText,
        }}
      >
        {children}
      </LoginProvider.Provider>
    </div>
  );
}

export default LoginContext;
