import React from "react";
import "./CommentModal.css";
import { useState } from "react";
import { API_BASE_URL } from "../utils/api";

const CommentModal = ({ open, onClose, post, comments }) => {
  const [commentText, setCommentText] = useState("");


  if (!open) return null;


  const onAddComment = async (e) => {
    e.preventDefault();
    try {

    const response = await fetch(`${API_BASE_URL}/api/posts/${post.postId}/comments`, { 

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
            content: commentText,
        })
     }) 

     console.log("Comment added:", response);
   

    }
    catch (error) {
      console.error("Error adding comment:", error);
    }

  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Comments</h2>
        <div className="post-preview">
          <strong>{post.username}</strong>: {post.content}
          <div><img src={post.imgContent} alt="Post content" style={{ width: "100%", height: "300px" }} /></div>
        </div>
        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">No comments yet.</div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <strong>{comment.username}</strong>: {comment.content}
                {/* Render replies recursively if needed */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="comment-replies">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="comment-reply">
                        <strong>{reply.username}</strong>: {reply.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
