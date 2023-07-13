import React from "react";
import { useState } from "react";
import { createContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [updatedFollowings, setUpdatingFollowings] = useState({});

  const handleLike = async (id) => {
    try {
      const response = await fetch(`/api/posts/like/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      setPosts(result.posts);
      setLikedPosts([...likedPosts, posts.find((e) => e._id === id)]);

      toast.success("You liked a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (id) => {
    try {
      const response = await fetch(`/api/posts/dislike/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result);
      setPosts(result.posts);
      setLikedPosts(likedPosts.filter((e) => e._id !== id));

      toast.success("You unliked a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result);
      setPosts(result.posts);

      toast.success("You deleted a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async (id) => {
    try {
      const response = await fetch(`/api/users/bookmark/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result);
      setBookmarkPosts((prevState) => [...prevState, ...result.bookmarks]);

      toast.success("You bookmarked a post!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      const response = await fetch(`/api/users/remove-bookmark/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result, "REMOVE BOOKMARK RESULT");
      setBookmarkPosts(result.bookmarks);
      toast.success("Bookmark removed!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.error(err);
    }
  };

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
          updatedFollowings,
          setUpdatingFollowings,
          handleBookmark,
          handleRemoveBookmark,
          handleDelete,
          handleLike,
          handleDislike,
        }}
      >
        {children}
      </LoginProvider.Provider>
      <ToastContainer />
    </div>
  );
}

export default LoginContext;
