import React, { useState } from "react";

import { useContext } from "react";
import { LoginProvider } from "..";
import { API_BASE_URL } from "../utils/api";
import { refreshAccessToken } from "../utils/refreshAccessToken";

function PostBox({
  isPostboxOpen,
  setIsPostBoxOpen,
  firstName,
  profileImg,
  setRefreshTrigger
}) {
    const { encodedToken, setEncodedToken, setPosts } = useContext(LoginProvider);
    // Helper for authenticated API calls
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

    const handlePostClick = async () => {
      if (!content) return;
      setIsPosting(true);
      try {
        const validateResponse = await fetchWithAuth('/api/ai/validate-post', {
          method: 'POST',
          body: JSON.stringify({ text: content }),
        });
        if (!validateResponse.ok) {
          alert("Failed to validate post content. Please try again.");
          setIsPosting(false);
          return;
        }
        const validateResult = await validateResponse.json();
        if (!validateResult.isBookRelated) {
          alert("Your post does not seem to be related to books. Please make sure your post is about books or reading.");
          setIsPosting(false);
          return;
        }
        const formData = new FormData();
        formData.append('content', content);
        if (imgContent) {
          formData.append('image', imgContent);
        }
        const response = await fetchWithAuth('/api/posts', {
          method: "POST",
          body: formData,
        });
        if (response && response.ok) {
          setContent("");
          setImgContent(null);
          setPreview(null);
          setIsPostBoxOpen(false);
          if (setPosts) setPosts(prev => [response.data, ...prev]);


        }
      } catch (err) {
        console.error('Error creating post:', err);
      }
      setIsPosting(false);
    };
  const [content, setContent] = useState("");
  const [imgContent, setImgContent] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isImproving, setIsImproving] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleImageSelect = (file) => {
    if (file) {
      setImgContent(file);
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    }
  };

  const handlePrevImgCloseClick = () => {
    setPreview(null);
    setImgContent(null);
  };

  const handleImprovePost = async (text) => {
    setIsImproving(true);
    try {
      // Call AI endpoint directly here
      const response = await fetchWithAuth('/api/ai/improve-post', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      if (response && response.ok) {
        const result = await response.json();
        setContent(result.improvedText);
      } else {
        alert('Failed to improve post');
      }
    } catch (err) {
      console.error('Error improving post:', err);
      alert('Failed to improve post');
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div>
      {isPostboxOpen && <div className="postbox--backdrop" onClick={() => setIsPostBoxOpen(false)} />}
      <div className={`postbox--div ${isPostboxOpen ? "noBlur" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <img src={profileImg} className="postbox--profile" alt="profile" />
          <button className="close--btn" onClick={() => setIsPostBoxOpen(false)}>
            ✕
          </button>
        </div>
        
        <textarea
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder={`Start writing here, ${firstName}!`}
        />

        {preview && (
          <div className="previewImg--div">
            <i
              className="fa-sharp fa-regular fa-circle-xmark"
              id="close--icon"
              onClick={handlePrevImgCloseClick}
            ></i>
            <img
              src={preview}
              alt="preview"
              className="preview--img"
            />
          </div>
        )}

        <div className="post-actions">
          <label htmlFor="file-input" className="img--select--label" title="Upload image">
            <i className="fa-solid fa-image"></i>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="img--select"
            onChange={(e) => handleImageSelect(e.target.files[0])}
          />
          <button
            onClick={() => handleImprovePost(content)}
            className="improve--btn"
            disabled={isImproving}
            title="Improve post with AI"
          >
            {isImproving ? (
              <>
                <i className="fa-solid fa-wand-magic-sparkles"></i> Improving...
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles"></i> Improve
              </>
            )}
          </button>
          <button onClick={handlePostClick} className="post--btn" disabled={isPosting}>
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostBox;
