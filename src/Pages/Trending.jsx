import React, { useEffect, useContext, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import { LoginProvider } from "..";
import Post from "../components/Post";
import { API_BASE_URL } from "../utils/api";
import { refreshAccessToken } from "../utils/refreshAccessToken"; 

function Trending() {
  const { encodedToken, setAllUsers, followedUsers, setEncodedToken } = // Add setEncodedToken
    useContext(LoginProvider);
  
  const [posts, setPosts] = useState([]);
  const [editedPost, setEditedPost] = useState("");
  const [editedImgContent, setEditedImgContent] = useState("");
  const [editedPostID, setEditedPostID] = useState("");
  const [imgContent, setImgContent] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editboxPreviewImg, setEditPreviewImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch trending posts with token refresh
  const getPosts = async () => {
    try {
      let token = encodedToken || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/posts/trending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Fixed: Use Bearer format
        },
        credentials: 'include',
      });

      // Handle token expiration
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          // Update context with new token
          if (setEncodedToken) setEncodedToken(token);
          
          // Retry request with new token
          const retryResponse = await fetch(`${API_BASE_URL}/api/posts/trending`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          });
          
          if (retryResponse.ok) {
            const result = await retryResponse.json();
            setPosts(result.posts);
            return;
          }
        } else {
          // Refresh failed, redirect to login
          window.location.href = '/login';
          return;
        }
      }

      if (response.ok) {
        const result = await response.json();
        setPosts(result.posts);
      }
    } catch (err) {
      console.error('Error fetching trending posts:', err);
    }
  };

  // Get all users (public endpoint)
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

  // Handle edit post with token refresh
  const handleUpdate = async (id) => {
    try {
      let token = encodedToken || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/posts/edit/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postData: {
            content: editedPost,
            imgContent: editedImgContent,
          },
        }),
        credentials: 'include',
      });

      // Handle token expiration
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          // Update context with new token
          if (setEncodedToken) setEncodedToken(token);
          
          // Retry request with new token
          const retryResponse = await fetch(`${API_BASE_URL}/api/posts/edit/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              postData: {
                content: editedPost,
                imgContent: editedImgContent,
              },
            }),
            credentials: 'include',
          });
          
          if (retryResponse.ok) {
            const result = await retryResponse.json();
            setPosts(result.posts);
            setEditedPostID("");
            setIsEditBoxOpen(false);
            return;
          }
        } else {
          // Refresh failed
          window.location.href = '/login';
          return;
        }
      }

      if (response.ok) {
        const result = await response.json();
        setPosts(result.posts);
        setEditedPostID("");
        setIsEditBoxOpen(false);
      }
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleEdit = (id) => {
    const post = posts.find((e) => e._id === id);
    setEditedPost(post.content);
    setEditedImgContent(post.imgContent);
    setEditedPostID(post._id);
    setIsEditBoxOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    getPosts();
    getUsers();
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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

  // Sort posts by createdAt if needed (trending might already be sorted by backend)
  const displayedPosts = posts;

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
            {displayedPosts.map((post) => (
              <Post
                key={post._id} // Added key prop
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Trending;