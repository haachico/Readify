
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comment from "../components/Comment";
import  { API_BASE_URL } from "../utils/api";
import { refreshAccessToken } from "../utils/refreshAccessToken";

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyInputOpen, setReplyInputOpen] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        let token = localStorage.getItem("token");
        let res = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          credentials: 'include',
        });
        if (res.status === 401) {
          token = await refreshAccessToken();
          if (token) {
            res = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
              credentials: 'include',
            });
          }
        }
        const data = await res.json();
        setPost(data.post);
      } catch (err) {
        console.error("Error fetching post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  console.log("Post details:", post);

  // Fetch comments for the post
  const getCommentsByPostId = async () => {
    try {
      let token = localStorage.getItem("token");
      let response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        credentials: 'include',
      });
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            credentials: 'include',
          });
        }
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (postId) getCommentsByPostId();
  }, [postId]);

  const onAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          content: commentText,
        })
      });
      if (response.ok) {
        setCommentText("");
        getCommentsByPostId();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (e, commentId) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ content: replyText, postId: postId }),
      });
      if (response.ok) {
        setReplyText("");
        setReplyInputOpen(null);
        getCommentsByPostId();
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeleteComment = async (e, commentId) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      if (response.ok) {
        getCommentsByPostId();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div className="not-found">Post not found.</div>;

return (
  <div className="post-details-page">
    <div className="post-details-container">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {/* Main Post */}
      <div className="main-post">
        <div className="post-header">
          <img
            src={post.image}
            alt="profile"
            className="post-profile-img"
          />
          <div>
            <strong>{post.firstName} {post.lastName}</strong>
            <div className="username">@{post.username}</div>
          </div>
        </div>

        <div className="post-content">
          <p>{post.content}</p>
          {post.imgContent && <img src={post.imgContent} alt="post" className="post-main-img" />}
        </div>

        <div className="post-meta">
          <span>{post.likes.likeCount || 0} Likes</span>
          <span>{comments.length} Comments</span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Add Comment */}
      <form className="add-comment-form" onSubmit={onAddComment}>
        <input
          value={commentText}
          type="text"
          placeholder="Write a comment..."
          required
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Comment</button>
      </form>

      {/* Comments */}
      <div className="comments-section">
        <h3>Replies</h3>
        {comments.length === 0 ? (
          <div className="no-comments">No comments yet</div>
        ) : (
          comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              handleDeleteComment={handleDeleteComment}
              replyInputOpen={replyInputOpen}
              setReplyInputOpen={setReplyInputOpen}
              handleAddReply={handleAddReply}
              replyText={replyText}
              setReplyText={setReplyText}
              postId={postId}
            />
          ))
        )}
      </div>

    </div>
  </div>
);

};

export default PostDetails;