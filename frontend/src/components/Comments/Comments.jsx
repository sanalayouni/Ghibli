import React, { useState, useEffect } from 'react';
import './Comments.css';

const Comments = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/movies/${movieId}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
      setError('Could not load comments. Ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to post a comment.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/movies/${movieId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (!res.ok) {
        throw new Error('Failed to post comment');
      }

      setNewComment('');
      fetchComments(); // Reload comments
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete comment');
      }
      fetchComments();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <div className="comments-loading">Loading comments...</div>;

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this movie..."
          rows="3"
        />
        <button type="submit" disabled={!newComment.trim()}>Post Comment</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment._id} className="comment-card">
            <div className="comment-header">
              <span className="comment-author">{comment.user?.username || 'Unknown'}</span>
              <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="comment-content">{comment.content}</p>
            <button 
              className="delete-btn" 
              onClick={() => {
                if(window.confirm('Are you sure you want to delete this comment?')) handleDelete(comment._id);
              }}
              title="Delete Comment"
            >
              ×
            </button>
          </div>
        ))}
        {comments.length === 0 && !error && (
          <p className="no-comments">Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
