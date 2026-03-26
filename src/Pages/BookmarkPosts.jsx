import React, { useEffect } from "react";
import { useContext, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";

import { LoginProvider } from "..";
import Post from "../components/Post";
import { API_BASE_URL } from "../utils/api";
import { updatePostsAfterLikeToggle } from "../utils/postState";
import Feed from "../components/Feed";
import { refreshAccessToken } from "../utils/refreshAccessToken";

function BookmarkPost() {
  const {
    encodedToken,
    setEncodedToken,
    // bookmarkPosts,
    setAllUsers,
    followedUsers,
    loggedInUserDetails,
    posts,
    setPosts,
    userID,
  } = useContext(LoginProvider);

  // const [editedPost, setEditedPost] = useState("");
  // const [editedImgContent, setEditedImgContent] = useState("");
  // const [editedPostID, setEditedPostID] = useState("");
  // const [imgContent, setImgContent] = useState(null);
  // const [preview, setPreview] = useState(null);
  // const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  // const [editboxPreviewImg, setEditPreviewImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // const [bookmarkPosts, setBookmarkPosts] = useState([]);

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

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // const handleEdit = (id) => {
  //   const post = posts.find((e) => e._id == id);

  //   setEditedPost(post.content);
  //   setEditedImgContent(post.imgContent);
  //   setEditedPostID(post._id);
  //   setIsEditBoxOpen((prevState) => !prevState);
  // };



  // const handleUpdate = async (id) => {
  //   // /api/posts/edit/:postId
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/posts/edit/${id}`, {
  //       method: "POST", // or 'PUT'
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: encodedToken,
  //       },
  //       body: JSON.stringify({
  //         postData: {
  //           content: editedPost,
  //           imgContent: editedImgContent,
  //         },
  //       }),
  //     });

  //     const result = await response.json();
  //     setPosts(result.posts);
  //     setEditedPostID("");
  //     setIsEditBoxOpen((prevState) => !prevState);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const getPosts = async () => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/posts/bookmarks`, {
  //       method: "GET", // or 'PUT'
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: encodedToken,
  //       },
  //     });

  //     const result = await response.json();

  //     setBookmarkPosts(result.posts);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const getUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "GET", // or 'PUT'
      });

      const result = await response.json();

      setAllUsers(result.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // getPosts();
    getUsers();
  }, []);

  // const sortedPosts = posts
  //   .filter((post) =>
  //     bookmarkPosts.some((bookmark) => bookmark._id === post._id)
  //   )
  //   .sort((a, b) => {
  //     const dateA = new Date(a.createdAt);
  //     const dateB = new Date(b.createdAt);

  //     return dateB - dateA;
  //   });

  // console.log(sortedPosts, " SORTED POST");

  // console.log(bookmarkPosts, "BOOKMARK POSTS");

  // useEffect(() => {
  //   if (!imgContent) {
  //     setPreview(undefined);

  //     return;
  //   }

  //   // const objectUrl = URL.createObjectURL(imgContent);
  //   setPreview(imgContent);

  //   // free memory when ever this component is unmounted
  //   // return () => URL.revokeObjectURL(objectUrl);
  // }, [imgContent]);

  // useEffect(() => {
  //   if (!editedImgContent) {
  //     setEditPreviewImg(undefined);
  //   }
  //   setEditPreviewImg(editedImgContent);
  // }, [editedImgContent]);

  // const handleLocalLikeToggle = (postId, shouldLike) => {
  //   setBookmarkPosts((currentPosts) =>
  //     updatePostsAfterLikeToggle(currentPosts, postId, userID, shouldLike)
  //   );
  // };

  console.log(bookmarkPosts, "BOOKMARK POSTS");
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
            <div>
                <Feed 
                refreshTrigger={refreshTrigger}
                endpoint="/api/posts/bookmarks"
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
      )}
    </div>
  );
}

export default BookmarkPost;
