import React from "react";
import { useContext } from "react";

import { LoginProvider } from "..";

function BookmarkPosts() {
  const { bookmarkPosts } = useContext(LoginProvider);
  return (
    <div>
      {bookmarkPosts.map((post) => (
        <div>
          <p>{post.username}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default BookmarkPosts;
