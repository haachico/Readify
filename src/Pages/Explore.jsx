// Explore.jsx - Fixed component
import React, { useEffect, useContext, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import { LoginProvider } from "..";
import Post from "../components/Post";
import { API_BASE_URL } from "../utils/api";
import { refreshAccessToken } from "../utils/refreshAccessToken"; // Import the helper
// import { updatePostsAfterLikeToggle } from "../utils/postState";
import Feed from "../components/Feed";

function Explore() {
  const { encodedToken, setAllUsers, posts, setPosts, setEncodedToken, userID } = // Add setEncodedToken
    useContext(LoginProvider);

  // const [editedPost, setEditedPost] = useState("");
  // const [editedImgContent, setEditedImgContent] = useState("");
  // const [editedPostID, setEditedPostID] = useState("");
  // const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  // const [editboxPreviewImg, setEditPreviewImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch posts with token refresh logic
  // const getPosts = async () => {
  //   try {
  //     let token = encodedToken || localStorage.getItem('token');
      
  //     const response = await fetch(`${API_BASE_URL}/api/posts`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`, // Fixed: Use Bearer token
  //       },
  //       credentials: 'include',
  //     });

  //     // Handle token expiration
  //     if (response.status === 401) {
  //       token = await refreshAccessToken();
  //       if (token) {
  //         // Update context with new token
  //         if (setEncodedToken) setEncodedToken(token);
          
  //         // Retry request with new token
  //         const retryResponse = await fetch(`${API_BASE_URL}/api/posts`, {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           credentials: 'include',
  //         });
          
  //         if (retryResponse.ok) {
  //           const result = await retryResponse.json();
  //           setPosts(result.posts);
  //           return;
  //         }
  //       } else {
  //         // Refresh failed, redirect to login
  //         window.location.href = '/login';
  //         return;
  //       }
  //     }

  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log(response, result, "we are checking from Explore");
  //       setPosts(result.posts);
  //     }
  //   } catch (err) {
  //     console.error('Error fetching posts:', err);
  //   }
  // };

     const fetchWithAuth = async (url, options = {}) => {
        let token = encodedToken || localStorage.getItem('token');
        
        const defaultOptions = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          ...options,
        };
    
        if (options.body && !(options.body instanceof FormData)) {
          defaultOptions.headers['Content-Type'] = 'application/json';
        }
    
        let response = await fetch(`${API_BASE_URL}${url}`, defaultOptions);
    
        if (response.status === 401) {
          token = await refreshAccessToken();
          if (token) {
            if (setEncodedToken) setEncodedToken(token);
            
            response = await fetch(`${API_BASE_URL}${url}`, {
              ...defaultOptions,
              headers: {
                ...defaultOptions.headers,
                'Authorization': `Bearer ${token}`,
              },
            });
          } else {
            window.location.href = '/login';
            return null;
          }
        }
    
        return response;
      };

  // Get all users (public endpoint, no auth needed)
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
  // const handleUpdate = async (id) => {
  //   try {
  //     let token = encodedToken || localStorage.getItem('token');
      
  //     const response = await fetch(`${API_BASE_URL}/api/posts/edit/${id}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         postData: {
  //           content: editedPost,
  //           imgContent: editedImgContent,
  //         },
  //       }),
  //       credentials: 'include',
  //     });

  //     // Handle token expiration
  //     if (response.status === 401) {
  //       token = await refreshAccessToken();
  //       if (token) {
  //         // Update context with new token
  //         if (setEncodedToken) setEncodedToken(token);
          
  //         // Retry request with new token
  //         const retryResponse = await fetch(`${API_BASE_URL}/api/posts/edit/${id}`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({
  //             postData: {
  //               content: editedPost,
  //               imgContent: editedImgContent,
  //             },
  //           }),
  //           credentials: 'include',
  //         });
          
  //         if (retryResponse.ok) {
  //           const result = await retryResponse.json();
  //           setPosts(result.posts);
  //           setEditedPostID("");
  //           setIsEditBoxOpen(false);
  //           return;
  //         }
  //       } else {
  //         // Refresh failed
  //         window.location.href = '/login';
  //         return;
  //       }
  //     }

  //     if (response.ok) {
  //       const result = await response.json();
  //       setPosts(result.posts);
  //       setEditedPostID("");
  //       setIsEditBoxOpen(false);
  //     }
  //   } catch (err) {
  //     console.error('Error updating post:', err);
  //   }
  // };

  // const handleEdit = (id) => {
  //   const post = posts.find((e) => e._id === id);
  //   setEditedPost(post.content);
  //   setEditedImgContent(post.imgContent);
  //   setEditedPostID(post._id);
  //   setIsEditBoxOpen(true);
  // };

  // const handleLocalLikeToggle = (postId, shouldLike) => {
  //   setPosts((currentPosts) =>
  //     updatePostsAfterLikeToggle(currentPosts, postId, userID, shouldLike)
  //   );
  // };

  useEffect(() => {
    setIsLoading(true);
    // getPosts();
    getUsers();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   setEditPreviewImg(editedImgContent);
  // }, [editedImgContent]);

  // const sortedPosts = [...posts].sort((a, b) => {
  //   return new Date(b.createdAt) - new Date(a.createdAt);
  // });

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Explore</h2>
     
        <div className="posts--div">
          <div>
            <Feed 
                refreshTrigger={refreshTrigger}
                endpoint="/api/posts"
                // params={{ sort: pressedButton ? pressedButton.toLowerCase() : "latest" }}
                fetchWithAuth={fetchWithAuth}
                renderPost={(post) => (
                  <Post
                    key={post._id}
                    fetchWithAuth={fetchWithAuth}
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
                    isBookmarked={post.isBookmarked}
                    onBookmarkChange={() => setRefreshTrigger(prev => prev + 1)}
                  />
                )}
              />
          </div>
        </div>

    </div>
  );
}

export default Explore;