import React from "react";
import { useState, useEffect } from "react";
import { createContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL, authAPI } from "../utils/api";
import { refreshAccessToken as refreshAccessTokenUtil } from "../utils/refreshAccessToken";

export const LoginProvider = createContext();

export function LoginContext({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [encodedToken, setEncodedToken] = useState("");
  // Add a state for tracking token refresh
  const [refreshingToken, setRefreshingToken] = useState(false);
  // Use the utility version for refreshAccessToken
  const refreshAccessToken = async () => {
    setRefreshingToken(true);
    try {
      const token = await refreshAccessTokenUtil();
      if (token) {
        setEncodedToken(token);
        setRefreshingToken(false);
        return token;
      } else {
        setRefreshingToken(false);
        handleLogout();
        return null;
      }
    } catch (error) {
      setRefreshingToken(false);
      handleLogout();
      return null;
    }
  };
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
      let response = await fetch(`${API_BASE_URL}/api/posts/like/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });
      if (response.status === 401) {
        // Try to refresh token
        const newToken = await refreshAccessToken();
        if (newToken) {
          response = await fetch(`${API_BASE_URL}/api/posts/like/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: newToken,
            },
          });
        }
      }
      const result = await response.json();
      toast.success("You liked a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (id) => {
    try {
      let response = await fetch(`${API_BASE_URL}/api/posts/like/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          response = await fetch(`${API_BASE_URL}/api/posts/like/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: newToken,
            },
          });
        }
      }
      const result = await response.json();
      toast.success("You unliked a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      let response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: newToken,
            },
          });
        }
      }
      const result = await response.json();
      toast.success("You deleted a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async (id) => {
    try {
      let response = await fetch(`${API_BASE_URL}/api/posts/bookmarks/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          response = await fetch(`${API_BASE_URL}/api/posts/bookmarks/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: newToken,
            },
          });
        }
      }
      const result = await response.json();
      toast.success("You bookmarked a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      let response = await fetch(`${API_BASE_URL}/api/posts/remove-bookmark/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          response = await fetch(`${API_BASE_URL}/api/posts/remove-bookmark/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: newToken,
            },
          });
        }
      }
      const result = await response.json();
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
          refreshAccessToken,
        }}
      >
        {children}
      </LoginProvider.Provider>
      <ToastContainer />
    </div>
  );
}

export default LoginContext;
