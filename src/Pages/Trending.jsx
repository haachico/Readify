import React, { useEffect } from "react";
import { useContext, useState } from "react";

import { LoginProvider } from "..";
import { Link } from "react-router-dom";

function Home() {
  const {
    firstName,
    lastName,
    email,
    encodedToken,
    username,
    userID,
    bookmarkPosts,
    setBookmarkPosts,
    likedPosts,
    dislikedPosts,
    setLikedPosts,
    setDislikedPosts,
    allUsers,
    setAllUsers,
    followedUsers,
    setFollowedUsers,
    isPostboxOpen,
    setIsPostBoxOpen,
  } = useContext(LoginProvider);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [editedPost, setEditedPost] = useState("");
  const [editedPostID, setEditedPostID] = useState("");

  const handleEdit = (id) => {
    const post = posts.find((e) => e._id == id);

    setEditedPost(post.content);
    setEditedPostID(post._id);
  };

  console.log(followedUsers, "FOLLOWED USERS");

  const handleUpdate = async (id) => {
    // /api/posts/edit/:postId
    try {
      const response = await fetch(`api/posts/edit/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({
          postData: {
            content: editedPost,
          },
        }),
      });

      const result = await response.json();
      console.log("Success:", result);
      setPosts(result.posts);
      setEditedPostID("");
      // setEditedPost("");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePost = async () => {
    if (!content) return;
    try {
      console.log(encodedToken, "ENCODED TOKEN");
      const response = await fetch("/api/posts", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({
          postData: {
            content: content,
          },
        }),
      });

      const result = await response.json();
      console.log("Success:", result);
      setPosts(result.posts);
      setContent("");
      setIsPostBoxOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getPosts = async () => {
    try {
      const response = await fetch("/api/posts", {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result, "FETCHED POSTS");

      setPosts(result.posts);
    } catch (err) {
      console.error(err);
    }
  };

  const getUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "GET", // or 'PUT'
      });

      const result = await response.json();

      setAllUsers(result.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPosts();
    getUsers();
  }, []);

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
      setBookmarkPosts(result.bookmarks);
    } catch (err) {
      console.error(err);
    }
  };

  const sortedPosts = posts.sort(
    (a, b) => b.likes.likeCount - a.likes.likeCount
  );
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main--body">
      <div></div>
      <div className="posts--div">
        <div
          className="post--div"
          onClick={() => setIsPostBoxOpen((prevState) => !prevState)}
        >
          <div>What is in your mind, {firstName}?</div>
        </div>
        {isPostboxOpen && (
          <div className={`postbox--div ${isPostboxOpen ? "noBlur" : ""}`}>
            <textarea
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: "28rem",
                height: "10rem",
              }}
              placeholder={`What is in your mind, ${firstName}?`}
            />
            <button
              className="close--btn"
              onClick={() => setIsPostBoxOpen(false)}
            >
              x
            </button>
            <button onClick={handlePost} className="post--btn">
              Post
            </button>
          </div>
        )}
        <div>
          {sortedPosts.map(
            (post) =>
              (followedUsers
                .map((e) => e.followUser?.username)
                .includes(post.username) ||
                post.username === username) && (
                <div>
                  <p>{post.username}</p>
                  {post._id === editedPostID ? (
                    <>
                      <textarea
                        type="text"
                        value={editedPost}
                        onChange={(e) => setEditedPost(e.target.value)}
                        style={{ width: "18rem", height: "6rem" }}
                      />
                      <button onClick={() => handleUpdate(post._id)}>
                        Update
                      </button>
                    </>
                  ) : (
                    <p style={{ color: "white" }}>{post.content}</p>
                  )}

                  <p>Likes: {post.likes.likeCount}</p>

                  {likedPosts.map((e) => e._id === post._id).includes(true) ? (
                    <button
                      onClick={() => handleDislike(post._id)}
                      style={{ color: "blue" }}
                    >
                      Like:
                    </button>
                  ) : (
                    <button onClick={() => handleLike(post._id)}>Like </button>
                  )}
                  <button onClick={() => handleBookmark(post._id)}>
                    Bookmark
                  </button>
                  {post.username === username && (
                    <button onClick={() => handleDelete(post._id)}>
                      Delete
                    </button>
                  )}
                  {post.username === username && (
                    <button onClick={() => handleEdit(post._id)}>Edit</button>
                  )}
                </div>
              )
          )}
        </div>
      </div>
      <div className="suggestedUsers--div">
        <h2>Suggested users</h2>
        {allUsers
          .filter((e) => e.username !== username)
          .map((user) => (
            <div>
              {/* if the followed user username is equal to current user username then show nothing else show user */}
              {followedUsers
                .map((e) => e.followUser.username)
                .includes(user.username) ? (
                ""
              ) : (
                <div className="user">
                  <img src={user.image} alt={user.username} />
                  <p>{user.username}</p>
                  <button onClick={() => handleFollow(user._id)}>Follow</button>
                </div>
              )}{" "}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;
