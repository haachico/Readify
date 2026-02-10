// Helper to refresh access token

import React, { useEffect } from "react";
import "./CommentModal.css";
import { useState } from "react";
import { API_BASE_URL } from "../utils/api";
import Comment from "./Comment";

const CommentModal = ({ open, onClose, post, comments , setComments}) => {
  const [commentText, setCommentText] = useState("");
  
  // State to track which comment's reply input is open and the reply text
  const [replyInputOpen, setReplyInputOpen] = useState(null);
  const [replyText, setReplyText] = useState("");
  
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok && result.encodedToken) {
        localStorage.setItem('token', result.encodedToken);
        return result.encodedToken;
      } else {
        localStorage.removeItem('token');
        return null;
      }
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  };
  const getCommentsByPostId = async () => {
    try {
      let token = localStorage.getItem("token");
      let response = await fetch(`${API_BASE_URL}/api/posts/${post.postId}/comments`, {
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
          response = await fetch(`${API_BASE_URL}/api/posts/${post.postId}/comments`, {
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
   if(post.postId) getCommentsByPostId();
}, [post.postId, open]);

  const onAddComment = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("token");
      let response = await fetch(`${API_BASE_URL}/api/posts/${post.postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({
          content: commentText,
        }),
        credentials: 'include',
      });
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(`${API_BASE_URL}/api/posts/${post.postId}/comments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            body: JSON.stringify({
              content: commentText,
            }),
            credentials: 'include',
          });
        }
      }
      console.log("Comment added:", response);
      getCommentsByPostId();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (e, commentId) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("token");
      let response = await fetch(`${API_BASE_URL}/api/comments/${commentId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ content: replyText , postId: post.postId }),
        credentials: 'include',
      });
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(`${API_BASE_URL}/api/comments/${commentId}/replies`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            body: JSON.stringify({ content: replyText , postId: post.postId }),
            credentials: 'include',
          });
        }
      }
      setReplyText("");
      setReplyInputOpen(null);
      getCommentsByPostId();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };


  const handleDeleteComment = async (e, commentId) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("token");
      let response = await fetch(`${API_BASE_URL}/api/posts/${post.postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        credentials: 'include',
      });
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(`${API_BASE_URL}/api/posts/${post.postId}/comments/${commentId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            credentials: 'include',
          });
        }
      }
      getCommentsByPostId();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

    if (!open) return null;


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Comments</h2>
        <div className="post-preview">
          <span><img src={post.profileImage} alt={`${post.username}'s profile`} style={{ width: "2rem", height: "2rem", borderRadius: "50%" }} /></span><strong>{post.username}</strong>: {post.content}
          { post.imgContent && <div><img src={post.imgContent} alt="Post content" style={{ width: "100%", height: "300px" }} /></div>}
        </div>
        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">No comments yet.</div>
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
             
             />
            ))
          )}
        </div>
        <form className="add-comment-form" onSubmit={onAddComment}>
          <input value={commentText} type="text" name="commentText" placeholder="Add a comment..." required onChange={(e)=> setCommentText(e.target.value)} />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
