import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import { API_BASE_URL } from "../utils/api";
import FadeLoader from "react-spinners/FadeLoader";
import { LoginProvider } from "../useContext/LoginContext";

const Feed = ({ 
  endpoint, 
  params = {}, 
  renderPost,
  fetchWithAuth,
  refreshTrigger
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // For initial load/refresh
  const [loadingMore, setLoadingMore] = useState(false); // For pagination
  const [isRefreshing, setIsRefreshing] = useState(false);

    const {
      posts,
      setPosts
    } = useContext(LoginProvider);

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
    if (pageNum === 1) {
      if (loading) return;
      setLoading(true);
    } else {
      if (loadingMore) return;
      setLoadingMore(true);
    }

    try {
      let url = `${endpoint}?page=${pageNum}&limit=5`;
      if (params.sort) {
        url += `&sort=${params.sort}`;
      }
      const response = await fetchWithAuth(url);
      const data = await response.json();

      if (shouldReplace) {
        setPosts(data.posts);
      } else {
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
      if (pageNum === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [fetchWithAuth, sortValue, loading, loadingMore]);

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
}, [paramsKey]);

  useEffect(() => {
    if (page === 1) return; 
    
    fetchPosts(page, false);
  }, [page]); 

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        <FadeLoader
          color={"#f5f5f5"}
          loading={true}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }
  if (!loading && posts?.length === 0) {
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

      {loadingMore && (
        <div style={{ display: "flex", justifyContent: "center", padding: "1rem" }}>
          <FadeLoader
            color={"#f5f5f5"}
            loading={true}
            size={30}
            aria-label="Loading More Spinner"
            data-testid="loader-more"
          />
        </div>
      )}

      {!hasMore && posts.length > 0 && <div>No more posts</div>}
    </div>
  );
};

export default Feed;