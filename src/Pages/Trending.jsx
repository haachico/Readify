import React, { useEffect } from "react";
import { useContext, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";

import { LoginProvider } from "..";
import Post from "../components/Post";

function Trending() {
  const { encodedToken, setAllUsers, followedUsers } =
    useContext(LoginProvider);
  // const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
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
      console.log("Success:", result);
      setPosts(result.posts);
      setEditedPostID("");
      setIsEditBoxOpen((prevState) => !prevState);
      // setEditedPost("");
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

  const sortedPosts = posts.sort(
    (a, b) => b.likes.likeCount - a.likes.likeCount
  );

  console.log(sortedPosts, " SORTED POST");

  useEffect(() => {
    if (!imgContent) {
      setPreview(undefined);

      return;
    }

    setPreview(imgContent);
  }, [imgContent]);

  useEffect(() => {
    if (!editedImgContent) {
      setEditPreviewImg(undefined);
    }
    setEditPreviewImg(editedImgContent);
  }, [editedImgContent]);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Trending</h2>
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
        </div>
      )}
    </div>
  );
}

export default Trending;
