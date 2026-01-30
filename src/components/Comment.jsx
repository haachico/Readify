const Comment  = ({comment, handleDeleteComment, replyInputOpen, setReplyInputOpen, handleAddReply, replyText, setReplyText})=> {
    return (
       <div key={comment.id} className="comment-item">
                <div className="comment-main-row">
                  <div className="comment-content-group">
                    <span><img src={comment.profileImage} alt={`${comment.username}'s profile`} style={{ width: "2rem", height: "2rem", borderRadius: "50%" }} /></span>
                    <strong>{comment.username}</strong>: {comment.content}
                  </div>
                  <button className="comment-delete-btn" title="Delete comment" onClick={e => handleDeleteComment(e, comment.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="comment-actions-row">
                  <button className="reply-btn" onClick={() => setReplyInputOpen(replyInputOpen === comment.id ? null : comment.id)}>
                    Reply
                  </button>
                </div>
                {/* Show reply input if this comment's reply is open */}
                {replyInputOpen === comment.id && (
                  <form className="reply-form" onSubmit={e => handleAddReply(e, comment.id)}>
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      required
                    />
                    <button type="submit">Post</button>
                  </form>
                )}
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
    )
}

export default Comment;