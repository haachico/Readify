import React, { useEffect, useContext, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import PostBox from "../components/PostBox";
import Post from "../components/Post";
import SortBtns from "../components/SortBtns";
import { LoginProvider } from "..";
import { API_BASE_URL } from "../utils/api";
import { refreshAccessToken } from "../utils/refreshAccessToken"; // Import refresh helper

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
    setEncodedToken, // Add this to context
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

  // Helper function for authenticated API calls
  const fetchWithAuth = async (url, options = {}) => {
    let token = encodedToken || localStorage.getItem('token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      ...options,
    };

    let response = await fetch(`${API_BASE_URL}${url}`, defaultOptions);

    console.log(response, "we are checking from Home")
    // Handle token expiration
    if (response.status === 401) {
      token = await refreshAccessToken();
      if (token) {
        // Update context with new token
        if (setEncodedToken) setEncodedToken(token);
        
        // Retry with new token
        response = await fetch(`${API_BASE_URL}${url}`, {
          ...defaultOptions,
          headers: {
            ...defaultOptions.headers,
            'Authorization': `Bearer ${token}`,
          },
        });
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return null;
      }
    }

    return response;
  };

  // loading for 1sec for loader when page loads
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (id) => {
    const post = posts?.find((e) => e._id === id);
    setEditedPost(post.content);
    setEditedImgContent(post.imgContent);
    setEditedPostID(post._id);
    setIsEditBoxOpen(true);
  };

  const getPosts = async () => {
    try {
      const response = await fetchWithAuth('/api/posts/feed');
      if (response && response.ok) {
        const result = await response.json();
        console.log(result, "result")
        setPosts(result.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const refreshFeed = async () => {
    try {
      const response = await fetchWithAuth('/api/posts/feed');
      if (response && response.ok) {
        const result = await response.json();
        setPosts(result.posts);
      }
    } catch (err) {
      console.error('Error refreshing feed:', err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetchWithAuth(`/api/posts/edit/${id}`, {
        method: "POST",
        body: JSON.stringify({
          content: editedPost,
          imgContent: editedImgContent,
        }),
      });

      if (response && response.ok) {
        const result = await response.json();
        setPosts(result.posts);
        setEditedPostID("");
        setIsEditBoxOpen(false);
        await getPosts();
      }
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handlePost = async () => {
    if (!content) return;
    
    try {
      const response = await fetchWithAuth('/api/posts', {
        method: "POST",
        body: JSON.stringify({
          content: content,
          imgContent: imgContent,
        }),
      });

      if (response && response.ok) {
        const result = await response.json();
        setContent("");
        setIsPostBoxOpen(false);
        setPreview(null);
        await getPosts();
      }
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const getUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        setAllUsers(result.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    getPosts();
    getUsers();
  }, []);

  const handleSort = async (optionName) => {
    setPressedButton(optionName);
    
    try {
      const sortParam = optionName.toLowerCase();
      const response = await fetchWithAuth(`/api/posts/feed?sort=${sortParam}`);
      
      if (response && response.ok) {
        const result = await response.json();
        setPosts(result.posts);
      }
    } catch (err) {
      console.error('Error sorting posts:', err);
    }
  };

  useEffect(() => {
    if (!imgContent) {
      setPreview(null);
    } else {
      setPreview(imgContent);
    }
  }, [imgContent]);

  useEffect(() => {
    setEditPreviewImg(editedImgContent);
  }, [editedImgContent]);

  const handlePrevImgCloseClick = () => {
    setPreview(null);
    setImgContent(null);
  };

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
                isPostboxOpen={isPostboxOpen} // Fixed: should be isPostboxOpen, not isEditBoxOpen
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
              {posts?.map((post) => (
                <Post
                  key={post._id}
                  postId={post._id}
                  postUsername={post.username}
                  image={post.image}
                  firstName={post.firstName}
                  lastName={post.lastName}
                  content={post.content}
                  imgContent={post.imgContent}
                  likesCount={post.likes.likeCount}
                  commentsCount={post.commentCount}
                  likedBy={post.likes.likedBy}
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
                  isBookmarked={post.isBookmarked}
                  onBookmarkChange={refreshFeed}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;