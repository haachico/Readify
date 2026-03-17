## Features

### 🔐 Authentication

- **Sign-up** - Create a new account with email & password
- **Login** - Secure login with JWT tokens
- **Google OAuth** - Sign in with Google account
- **Logout** - Secure logout with token blacklisting
- **Forgot Password** - Password recovery via email
- **Reset Password** - Secure password reset link
- **Token Refresh** - Automatic JWT token refresh (15m access, 7d refresh)

### 📰 User Feed

- **View User Feed** - See posts from followed users
- **View All Posts** - Browse posts from all users
- **Sort by Date** - View posts newest first
- **Sort by Trending** - View most liked/commented posts
- **Get Post Details** - View full post with all comments
- **Search Posts** - Find posts by content (via Explore)

### ✍️ Post Management

- **Create a Post** - Create text posts with optional image
- **Upload Images** - Post images with ImageKit cloud storage (persistent across restarts)
- **Edit Post** - Update post content and images
- **Delete Post** - Remove posts permanently
- **Like/Unlike Post** - Engage with posts
- **View Like Count** - See number of likes on each post
- **Get Posts by User** - View specific user's posts

### 📌 Bookmarks

- **Bookmark Post** - Save posts for later
- **View Bookmarked Posts** - Access saved posts in one place
- **Remove Bookmark** - Unbookmark posts

### 💬 Comments & Replies

- **Add Comment** - Comment on posts
- **View Comments** - See all comments on a post
- **Reply to Comments** - Nested comment replies
- **Delete Comment** - Remove own comments
- **Comment Notifications** - Get notified when people comment

### 👤 User Profile

- **View User Profile** - See user information & posts
- **Edit Profile** - Update bio and portfolio URL
- **Add/Change Avatar** - Upload profile picture
- **Update Bio** - Add personal description
- **Add Portfolio URL** - Link to personal website/portfolio
- **View User Posts** - See all posts by a specific user

### 👥 Follow System

- **Follow Users** - Subscribe to user's posts
- **Unfollow Users** - Stop following users
- **View Followers** - See who follows you
- **View Following** - See who you follow
- **Suggested Users** - Get follow recommendations
- **Follow Notifications** - Get notified when followed

### 🔔 Notifications

- **Real-time Notifications** - Get alerts for:
  - Likes on your posts
  - Comments on your posts
  - Replies to your comments
  - Bookmarks on your posts
  - New followers
- **Unread Notification Count** - See how many unread notifications
- **Mark as Read** - Mark notifications as read (single or all)
- **Notification History** - View all past notifications

### 🔍 Explore & Discovery

- **Explore Page** - Discover posts from all users
- **Trending Posts** - View most popular posts
- **Search Users** - Find users by username
- **Suggested Users** - Get follow recommendations

### 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, mobile
- **Comment Modal** - Inline comment viewing & adding
- **Post Interactions** - Smooth like/bookmark/comment interactions
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during API calls
- **Avatar Selection** - Choose from predefined avatars

### 🤖 AI-Powered Features (Google Gemini)

- **AI Post Improvement** - Enhance post text to be more engaging and compelling
  - Automatically improves grammar, clarity, and appeal
  - User sees improved version before posting
  - Preserves original meaning
- **AI Content Validation** - Ensure posts are book-related
  - Validates that posts are about books, reading, or literature
  - Rejects non-book content automatically
  - Keeps community focused on reading & books
  - Real-time validation feedback

### 🔒 Security & Performance

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevent spam/abuse
- **Email Verification** - Forgot password via email
- **Password Hashing** - bcrypt password encryption
- **Token Blacklisting** - Logout invalidates tokens
- **ImageKit CDN** - Images persist in cloud, not on server
- **Error Logging** - Track API errors and user actions
- **Redis Integration** - Cache management & token blacklisting

### 📊 Database Features

- **User Management** - Store user profiles & credentials
- **Post Storage** - Persist posts with images
- **Comment Threading** - Support nested replies
- **Like/Bookmark Tracking** - User interactions
- **Follow Relationships** - User connections
- **Notification History** - Track all notifications
- **Audit Logs** - Log all API activities
