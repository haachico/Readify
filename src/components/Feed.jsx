import React, { useEffect, useState, useRef, useCallback } from "react";
import { API_BASE_URL } from "../utils/api";

const Feed = ({ 
  endpoint, 
  params = {}, 
  renderPost,
  fetchWithAuth,
  refreshTrigger
}) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const observer = useRef();

  const lastPostRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && !isRefreshing) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, isRefreshing]);

  // Create stable values from params
  const sortValue = params.sort || 'latest';
  const paramsKey = `${endpoint}-${sortValue}`;

  const fetchPosts = useCallback(async (pageNum, shouldReplace = false) => {
    if (loading) return;
    
    setLoading(true);
        try {
           let url = `${endpoint}?page=${pageNum}&limit=5`;
    
            if (params.sort) {
            url += `&sort=${params.sort}`;
            }
            
      const response = await fetchWithAuth(url);
      const data = await response.json();
      
      if (shouldReplace) {
        // Replace all posts (for refresh or initial load)
        setPosts(data.posts);
      } else {
        // Append new posts, avoiding duplicates
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const newPosts = data.posts.filter(p => !existingIds.has(p._id));
          return [...prev, ...newPosts];
        });
      }
      
      setHasMore(data.posts.length === 5);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, sortValue, loading]);

 useEffect(() => {
  const abortController = new AbortController();
  
  const resetAndFetch = async () => {
    setIsRefreshing(true);
    setPage(1);
    setPosts([]);
    
    try {
      // Pass signal to fetchWithAuth
      await fetchPosts(1, true, abortController.signal);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      console.error('Error fetching posts:', error);
    }
    
    if (!abortController.signal.aborted) {
      setIsRefreshing(false);
    }
  };
  
  resetAndFetch();
  
  return () => {
    abortController.abort();
  };
}, [paramsKey, refreshTrigger]);

  useEffect(() => {
    if (page === 1) return; 
    
    fetchPosts(page, false);
  }, [page]); 


  if (!loading && posts.length === 0) {
  return <div>No posts found</div>;
}

  return (
    <div>
      {posts.map((post, idx) => (
        <div 
          ref={idx === posts.length - 1 ? lastPostRef : null} 
          key={post._id}
        >
          {renderPost ? renderPost(post) : <div>{post.content}</div>}
        </div>
      ))}
      {loading && <div>Loading...</div>}
      {!hasMore && posts.length > 0 && <div>No more posts</div>}
    </div>
  );
};

export default Feed;