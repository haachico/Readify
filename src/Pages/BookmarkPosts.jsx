import React, { useEffect } from "react";
import { useContext, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";

import { LoginProvider } from "..";
import Post from "../components/Post";

function BookmarkPost() {
  const {
    encodedToken,
    bookmarkPosts,
    setAllUsers,
    followedUsers,
    loggedInUserDetails,
    posts,
    setPosts,
  } = useContext(LoginProvider);

  const [editedPost, setEditedPost] = useState("");
  const [editedImgContent, setEditedImgContent] = useState("");
  const [editedPostID, setEditedPostID] = useState("");
  const [imgContent, setImgContent] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editboxPreviewImg, setEditPreviewImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEdit = (id) => {
    const post = posts.find((e) => e._id == id);

    setEditedPost(post.content);
    setEditedImgContent(post.imgContent);
    setEditedPostID(post._id);
    setIsEditBoxOpen((prevState) => !prevState);
  };

  console.log(followedUsers, "FOLLOWED USERS");
  console.log(loggedInUserDetails, "LOGGED IN USER DETAILS");

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
            imgContent: editedImgContent,
          },
        }),
      });

      const result = await response.json();
      setPosts(result.posts);
      setEditedPostID("");
      setIsEditBoxOpen((prevState) => !prevState);
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

  const sortedPosts = posts
    .filter((post) =>
      bookmarkPosts.some((bookmark) => bookmark._id === post._id)
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return dateB - dateA;
    });

  console.log(sortedPosts, " SORTED POST");

  console.log(bookmarkPosts, "BOOKMARK POSTS");

  useEffect(() => {
    if (!imgContent) {
      setPreview(undefined);

      return;
    }

    // const objectUrl = URL.createObjectURL(imgContent);
    setPreview(imgContent);

    // free memory when ever this component is unmounted
    // return () => URL.revokeObjectURL(objectUrl);
  }, [imgContent]);

  useEffect(() => {
    if (!editedImgContent) {
      setEditPreviewImg(undefined);
    }
    setEditPreviewImg(editedImgContent);
  }, [editedImgContent]);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Bookmarked Posts</h2>
      {isLoading ? (
        <FadeLoader
          color={"#f5f5f5"}
          loading={isLoading}
          size={300}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className="posts--div">
          {bookmarkPosts.length > 0 ? (
            <div>
              {sortedPosts.map((post) => (
                <Post
                  postId={post._id}
                  postUsername={post.username}
                  image={post.image}
                  firstName={post.firstName}
                  lastName={post.lastName}
                  content={post.content}
                  imgContent={post.imgContent}
                  likesCount={post.likes.likeCount}
                  createdAt={post.createdAt}
                  editedPostID={editedPostID}
                  isEditBoxOpen={isEditBoxOpen}
                  setIsEditBoxOpen={setIsEditBoxOpen}
                  editedPost={editedPost}
                  setEditedPost={setEditedPost}
                  editboxPreviewImg={editboxPreviewImg}
                  setEditPreviewImg={setEditPreviewImg}
                  setEditedImgContent={setEditedImgContent}
                  handleEdit={handleEdit}
                  handleUpdate={handleUpdate}
                />
              ))}
            </div>
          ) : (
            <h3 style={{ textAlign: "center" }}>No bookmarked posts yet.</h3>
          )}
        </div>
      )}
    </div>
  );
}

export default BookmarkPost;
