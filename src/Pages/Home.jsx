import React, { useEffect, useContext, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import PostBox from "../components/PostBox";
import Post from "../components/Post";
import SortBtns from "../components/SortBtns";
import { LoginProvider } from "..";
import { API_BASE_URL } from "../utils/api";
import { refreshAccessToken } from "../utils/refreshAccessToken";
import Feed from "../components/Feed";

function Home() {
  const {
    firstName,
    profileImg,
    encodedToken,
    setAllUsers,
    setEncodedToken,
  } = useContext(LoginProvider);

  const [isPostboxOpen, setIsPostBoxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pressedButton, setPressedButton] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Edit state - kept in Home to pass to Post
  // const [editedPost, setEditedPost] = useState("");
  // const [editedImgContent, setEditedImgContent] = useState("");
  // const [editedImgFile, setEditedImgFile] = useState(null);
  // const [editedPostID, setEditedPostID] = useState("");
  // const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  // const [editboxPreviewImg, setEditPreviewImg] = useState(null);

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

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle edit - receives post data from Post component
  // const handleEdit = (post) => {
  //   setEditedPost(post.content);
  //   setEditedImgContent(post.imgContent);
  //   setEditedImgFile(null);
  //   setEditedPostID(post._id);
  //   setIsEditBoxOpen(true);
  //   if (post.imgContent) {
  //     setEditPreviewImg(post.imgContent);
  //   } else {
  //     setEditPreviewImg(null);
  //   }
  // };

  // Handle update
  // const handleUpdate = async (id) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('content', editedPost);
  //     if (editedImgFile) {
  //       formData.append('image', editedImgFile);
  //     }

  //     const response = await fetchWithAuth(`/api/posts/edit/${id}`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response && response.ok) {
  //       setEditedPostID("");
  //       setIsEditBoxOpen(false);
  //       setEditedImgFile(null);
  //       setEditedImgContent("");
  //       setEditPreviewImg(null);
        
  //       // Refresh the feed
  //       setRefreshTrigger(prev => prev + 1);
  //     }
  //   } catch (err) {
  //     console.error('Error updating post:', err);
  //   }
  // };


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
    getUsers();
  }, []);

  const handleSort = (optionName) => {
    setPressedButton(optionName);
    setRefreshTrigger(prev => prev + 1);
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
                isPostboxOpen={isPostboxOpen}
                setIsPostBoxOpen={setIsPostBoxOpen}
                firstName={firstName}
                profileImg={profileImg}
                setRefreshTrigger={setRefreshTrigger}
              />
            )}
            
            {/* NO EDIT MODAL HERE - Edit modal is inside Post component */}
            
            <div style={{ width: "100%" }}>
              <Feed 
                refreshTrigger={refreshTrigger}
                endpoint="/api/posts/feed"
                params={{ sort: pressedButton ? pressedButton.toLowerCase() : "latest" }}
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
        </>
      )}
    </div>
  );
}

export default Home;