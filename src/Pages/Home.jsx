import React, { useEffect } from "react";
import { useContext, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import PostBox from "../components/PostBox";
import Post from "../components/Post";
import SortBtns from "../components/SortBtns";

import { LoginProvider } from "..";

function Home() {
  const {
    firstName,
    lastName,
    encodedToken,
    username,
    setAllUsers,
    followedUsers,
    profileImg,
    posts,
    setPosts,
  } = useContext(LoginProvider);

  const [content, setContent] = useState("");
  const [imgContent, setImgContent] = useState(null);
  const [isPostboxOpen, setIsPostBoxOpen] = useState(false);
  const [editedPost, setEditedPost] = useState("");
  const [editedImgContent, setEditedImgContent] = useState("");
  const [editedPostID, setEditedPostID] = useState("");
  const [preview, setPreview] = useState(null);
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editboxPreviewImg, setEditPreviewImg] = useState(null);
  const [pressedButton, setPressedButton] = useState(null);
  const [sortOption, setSortOption] = useState("LATEST");
  const [isLoading, setIsLoading] = useState(false);

  // loading for 1sec for loader when page loads
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEdit = (id) => {
    const post = posts?.find((e) => e._id == id);

    setEditedPost(post.content);
    setEditedImgContent(post.imgContent);
    setEditedPostID(post._id);
    setIsEditBoxOpen(true);
  };

  const handleUpdate = async (id) => {
    // /api/posts/edit/:postId
    try {
      const response = await fetch(`/api/posts/edit/${id}`, {
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
      setIsEditBoxOpen(false);

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
            imgContent: imgContent,
            image: profileImg,
            firstName: firstName,
            lastName: lastName,
          },
        }),
      });

      const result = await response.json();
      setPosts(result.posts);
      setContent("");
      setIsPostBoxOpen(false);
      setPreview(null);
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

  // below in return while mapping if you see, we set posts. as default
  const handleSort = (optionName) => {
    // let sortedData = [...posts];
    if (optionName === "LATEST") {
      setSortOption(optionName);
      setPressedButton(optionName);
    } else if (optionName === "OLDEST") {
      setSortOption(optionName);
      setPressedButton(optionName);
    } else if (optionName === "TRENDING") {
      // sortedData.sort((a, b) => b.likes.likeCount - a.likes.likeCount);
      setSortOption(optionName);
      setPressedButton(optionName);
    }
  };

  const postsData =
    sortOption === "LATEST"
      ? posts?.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          return dateB - dateA;
        })
      : sortOption === "OLDEST"
      ? posts?.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          return dateA - dateB;
        })
      : sortOption === "TRENDING"
      ? posts?.sort((a, b) => b.likes.likeCount - a.likes.likeCount)
      : "";

  console.log(imgContent, "IMG CONTENT");

  useEffect(() => {
    if (!imgContent) {
      setPreview(undefined);
    }
    setPreview(imgContent);
  }, [imgContent]);

  useEffect(() => {
    if (!editedImgContent) {
      setEditPreviewImg(undefined);
    }
    setEditPreviewImg(editedImgContent);
  }, [editedImgContent]);

  const handlePrevImgCloseClick = () => {
    setPreview(null);
    setImgContent(null);
  };

  console.log(posts, "POSTSS");

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Home</h2>
      {isLoading ? (
        <FadeLoader
          color={"#f5f5f5"}
          loading={isLoading}
          size={300}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          <SortBtns pressedButton={pressedButton} handleSort={handleSort} />
          <div className="posts--div">
            <div
              className="post--div"
              onClick={() => setIsPostBoxOpen((prevState) => !prevState)}
            >
              <img
                src={profileImg}
                alt=""
                style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
              />
              <div>What is in your mind, {firstName}?</div>
            </div>

            {isPostboxOpen && (
              <PostBox
                isPostboxOpen={isEditBoxOpen}
                setIsPostBoxOpen={setIsPostBoxOpen}
                content={content}
                setContent={setContent}
                imgContent={imgContent}
                setImgContent={setImgContent}
                firstName={firstName}
                handlePost={handlePost}
                preview={preview}
                handlePrevImgCloseClick={handlePrevImgCloseClick}
              />
            )}
            <div>
              {postsData?.map(
                (post) =>
                  // Those we have followed, that is those in the followedUsers array, we check if any of the usernames in the folllowedUser array contains the username of the post OR if the post's username is equal to loggedin user's username then only show the post. In short, we ensuring that only the posts of those we FOLLOW as welll as the logged in user's posts should appear.
                  (followedUsers
                    ?.map((e) => e.followUser?.username)
                    .includes(post.username) ||
                    post.username === username) && (
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
                  )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
