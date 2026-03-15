const updatePostsAfterLikeToggle = (posts, postId, userId, shouldLike) => {
  return posts.map((post) => {
    if (post._id !== postId) {
      return post;
    }

    const existingLikedBy = Array.isArray(post.likes?.likedBy)
      ? post.likes.likedBy
      : [];

    const nextLikedBy = shouldLike
      ? Array.from(new Set([...existingLikedBy, userId]))
      : existingLikedBy.filter((id) => id !== userId);

    return {
      ...post,
      likes: {
        ...post.likes,
        likeCount: nextLikedBy.length,
        likedBy: nextLikedBy,
      },
    };
  });
};

export { updatePostsAfterLikeToggle };