import React from "react";
import { useState, useEffect } from "react";
import { createContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../utils/api";

export const LoginProvider = createContext();

export function LoginContext({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  const [posts, setPosts] = useState([]);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [profileImg, setProfileImg] = useState(
    "https://img.freepik.com/free-icon/user_318-159711.jpg"
  );
  const [about, setAbout] = useState("");
  const [link, setLink] = useState("");
  const [updatedFollowings, setUpdatingFollowings] = useState({});

  // Load token and user data from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      const userData = JSON.parse(savedUser);
      setEncodedToken(savedToken);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setUsername(userData.username);
      setUserID(userData.userID);
      setProfileImg(userData.profileImg);
      setAbout(userData.about);
      setLink(userData.link);
      setFollowedUsers(userData.followedUsers);
      setIsLogin(true);
    }
    setIsLoading(false);
  }, []);

  // Save token and user data to localStorage whenever they change
  useEffect(() => {
    if (encodedToken && isLogin && firstName) {
      const userData = {
        firstName,
        lastName,
        email,
        username,
        userID,
        profileImg,
        about,
        link,
        followedUsers,
      };
      localStorage.setItem('token', encodedToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, [isLogin, encodedToken]);

  const handleLike = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/like/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      // setPosts(result.posts);
      // setLikedPosts([...likedPosts, posts.find((e) => e._id === id)]);

      toast.success("You liked a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/like/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result);
      // setPosts(result.posts);
      // setLikedPosts(likedPosts.filter((e) => e._id !== id));

      toast.success("You unliked a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: "DELETE", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result);
      // setPosts(result.posts);

      toast.success("You deleted a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/bookmarks/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      // console.log(result);
      // setBookmarkPosts((prevState) => [...prevState, ...result.bookmarks]);

      toast.success("You bookmarked a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/remove-bookmark/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result, "REMOVE BOOKMARK RESULT");
      // setBookmarkPosts(result.bookmarks);

      toast.success("Bookmark removed!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = () => {
    toast.success("Feature coming soon!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset all state
    setIsLogin(false);
    setEncodedToken("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setUsername("");
    setUserID("");
    setBookmarkPosts([]);
    setLikedPosts([]);
    setDislikePosts([]);
    setFollowedUsers([]);
    setPosts([]);
    setLoggedInUserDetails({});
    setAbout("");
    setLink("");
  };

  return (
    <div>
      <LoginProvider.Provider
        value={{
          isLogin,
          setIsLogin,
          isLoading,
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
          setUserID,
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
          updatedFollowings,
          setUpdatingFollowings,
          handleBookmark,
          handleRemoveBookmark,
          handleDelete,
          handleLike,
          handleDislike,
          handleComment,
          handleLogout,
        }}
      >
        {children}
      </LoginProvider.Provider>
      <ToastContainer />
    </div>
  );
}

export default LoginContext;
