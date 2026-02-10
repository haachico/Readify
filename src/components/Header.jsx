import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchComponent from "./SearchComponent";

import { LoginProvider } from "..";
import { API_BASE_URL } from "../utils/api";

function Header() {
  const [searchText, setSearchText] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);
  const { allUsers, setAllUsers, encodedToken } = useContext(LoginProvider) || {};

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  
  // Helper to refresh access token
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
  async function fetchNotifications() {
    try {
      let token = encodedToken || localStorage.getItem('token');
      let res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        },
        credentials: 'include',
      });
      if (res.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          res = await fetch(`${API_BASE_URL}/api/notifications`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include',
          });
        }
      }
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Notification fetch error:', err);
    }
  }
  useEffect(() => {
    // Fetch notifications on mount
    fetchNotifications();
  }, [encodedToken]);


  const handleReadNotification = async (notification) => {

    try {

      let token = encodedToken || localStorage.getItem('token');
      let res = await fetch(`${API_BASE_URL}/api/notifications/${notification.id}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined
        },
        credentials: 'include',
      });
      if (res.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          res = await fetch(`${API_BASE_URL}/api/notifications/${notification.id}/read`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include',
          });
        }
      }
      if (notification.type === 'like' || notification.type === 'comment' || notification.type === 'bookmark') {
        let url = `/post/${notification.postId}`;
        navigate(url);
        setShowDropdown(false);
        fetchNotifications();
      }


    }
    catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearch = async (value) => {
    setSearchText(value);
    
    if (!value.trim()) {
      setFilteredUser([]);
      return;
    }

    try {
      let token = encodedToken || localStorage.getItem('token');
      let response = await fetch(`${API_BASE_URL}/api/users/search?query=${value}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        },
        credentials: 'include',
      });
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(`${API_BASE_URL}/api/users/search?query=${value}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined
            },
            credentials: 'include',
          });
        }
      }
      const { users } = await response.json();
      setFilteredUser(users);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className="header">
      <h1 style={{ marginLeft: "2rem" }}>
        <Link to="/">Readify</Link>
      </h1>
      <div className="header--nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <SearchComponent
          searchText={searchText}
          setSearchText={handleSearch}
        />

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="Notifications"
          >
            <span role="img" aria-label="bell" style={{ fontSize: 24 }}>🔔</span>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0, background: 'red',
                color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          {showDropdown && (
            <div style={{
              position: 'absolute', right: 0, top: '120%', background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)', width: 320, zIndex: 100,
              borderRadius: 8, maxHeight: 400, overflowY: 'auto',
              paddingTop: 32
            }}>
              {/* Close button */}
              <button
                onClick={() => setShowDropdown(false)}
                style={{
                  position: 'absolute', top: 4, right: 8, background: 'none', border: 'none', fontSize: 20, color: '#888', cursor: 'pointer', zIndex: 101
                }}
                aria-label="Close notifications"
              >
                &times;
              </button>
              {notifications.length === 0 ? (
                <div style={{ padding: 16, color: "black" }}>No notifications</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{ padding: 12, cursor: "pointer", color: "black", borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', background: n.isRead ? '#fff' : '#e6f7ff' }} onClick={()=> handleReadNotification(n)}>
                    <img src={n.sourceProfileImage} alt="" style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 10 }} />
                    <div>
                      <div style={{  fontWeight: n.isRead ? 'normal' : 'bold' }}>{n.message}</div>
                      <div style={{ fontSize: 12, color: '#888', color: "black" }}>{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {searchText && (
          <div className="search--list">
            {filteredUser.map((user) => (
              <div
                className="search--user"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "flex-start",
                }}
              >
                <Link
                  to={`/profile/${user.username}`}
                  onClick={() => setSearchText("")}
                >
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                    }}
                  />
                </Link>
                <Link
                  to={`/profile/${user.username}`}
                  onClick={() => setSearchText("")}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        justifyContent: "flex-start",
                        alignItems: "flex-end",
                      }}
                    >
                      <p style={{ marginBottom: "0px" }}>{user.firstName}</p>
                      <p style={{ marginBottom: "0px" }}>{user.lastName}</p>
                    </div>
                    <p style={{ fontSize: "10px", marginTop: "2px" }}>
                      @{user.username}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
