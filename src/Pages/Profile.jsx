import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import FadeLoader from "react-spinners/FadeLoader";

import { LoginProvider } from "..";
import Post from "../components/Post";
import UserProfile from "../components/UserProfile";

function Profile() {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isFollowersBoxOpen, setIsFollowersBoxOpen] = useState(false);
  const [isFollowingsBoxOpen, setIsFollowingsBoxOpen] = useState(false);

  const {
    encodedToken,
    allUsers,
    setAllUsers,
    followedUsers,
    setFollowedUsers,
    profileImg,
    setProfileImg,
    posts,
    setPosts,
    about,
    setAbout,
    link,
    setLink,
  } = useContext(LoginProvider);

  const [editedPost, setEditedPost] = useState("");
  const [editedImgContent, setEditedImgContent] = useState("");
  const [editedPostID, setEditedPostID] = useState("");
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editboxPreviewImg, setEditPreviewImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (id) => {
    const post = posts.find((e) => e?._id == id);

    setEditedPost(post.content);
    setEditedImgContent(post.imgContent);
    setEditedPostID(post?._id);
    setIsEditBoxOpen(true);
  };

  const handleUpdate = async (id) => {
    // /api/posts/edit/:postId
    try {
      const response = await fetch(`/api/posts/edit/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({
          postData: {
            content: editedPost,
            imgContent: editedImgContent,
          },
        }),
      });

      const result = await response.json();

      setPosts(result.posts);
      setEditedPostID("");
      setIsEditBoxOpen(false);
      // setEditedPost("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!editedImgContent) {
      setEditPreviewImg(undefined);
    }
    setEditPreviewImg(editedImgContent);
  }, [editedImgContent]);

  const { profileName } = useParams();

  const selectedUser = allUsers?.find((user) => user.username === profileName);

  const handleSaveEditForm = async (id) => {
    console.log("SUBMITEDDDD");

    try {
      const response = await fetch(`/api/users/edit`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({
          userData: {
            image: profileImg,
            about: about,
            link: link,
          },
        }),
      });

      const result = await response.json();

      setAllUsers(
        allUsers.map((user) =>
          user.username === result.user.username ? result.user : user
        )
      );

      const postResponse = await fetch(`/api/posts/edit/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({
          postData: {
            image: profileImg,
          },
        }),
      });
      const postResult = await postResponse.json();
      setPosts(postResult.posts);
      setEditedPostID("");
      // setIsEditBoxOpen(false);

      setIsEditFormOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowClick = async (id) => {
    try {
      const response = await fetch(`/api/users/follow/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      const result = await response.json();
      console.log(result, "follow fn called result");
      setFollowedUsers([...followedUsers, result]);

      const updatedAllUsers = allUsers.map((e) =>
        e.username === result.followUser.username
          ? result.followUser
          : e.username === result.user.username
          ? result.user
          : e
      );

      setAllUsers(updatedAllUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollowClick = async (id) => {
    try {
      const response = await fetch(`/api/users/unfollow/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });

      //ALL USERS NOT GETTING UPDATED //////////
      const result = await response.json();

      setFollowedUsers(
        followedUsers.filter(
          (e) => e.followUser.username !== result.followUser.username
        )
      );
      const updatedAllUsers = allUsers.map((e) =>
        e.username === result.followUser.username
          ? result.followUser
          : e.username === result.user.username
          ? result.user
          : e
      );

      setAllUsers(updatedAllUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const sortedPosts = posts?.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return dateB - dateA;
  });

  const postUpdateProfileId = posts.find(
    (e) => e.username === selectedUser.username
  )._id;

  return (
    <div>
      {isLoading ? (
        <FadeLoader
          color={"#f5f5f5"}
          loading={isLoading}
          size={300}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div>
          <UserProfile
            postId={selectedUser._id}
            firstName={selectedUser.firstName}
            lastName={selectedUser.lastName}
            image={selectedUser.image}
            userName={selectedUser.username}
            about={about}
            setAbout={setAbout}
            bioLink={selectedUser.link}
            setLink={setLink}
            followings={selectedUser.following}
            followers={selectedUser.followers}
            postUpdateProfileId={postUpdateProfileId}
            handleFollowClick={handleFollowClick}
            handleUnfollowClick={handleUnfollowClick}
            handleSaveEditForm={handleSaveEditForm}
            isFollowersBoxOpen={isFollowersBoxOpen}
            setIsFollowersBoxOpen={setIsFollowersBoxOpen}
            isFollowingsBoxOpen={isFollowingsBoxOpen}
            setIsFollowingsBoxOpen={setIsFollowingsBoxOpen}
            isEditBoxOpen={isEditBoxOpen}
            setIsEditBoxOpen={setIsEditBoxOpen}
            profileImg={profileImg}
            setProfileImg={setProfileImg}
            isEditFormOpen={isEditFormOpen}
            setIsEditFormOpen={setIsEditFormOpen}
          />
          <div className="posts--div">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((e) =>
                e && e?.username === profileName ? (
                  <Post
                    postId={e._id}
                    postUsername={e.username}
                    image={e.image}
                    firstName={e.firstName}
                    lastName={e.lastName}
                    content={e.content}
                    imgContent={e.imgContent}
                    likesCount={e.likes.likeCount}
                    createdAt={e.createdAt}
                    editedPostID={editedPostID}
                    isEditBoxOpen={isEditBoxOpen}
                    setIsEditBoxOpen={setIsEditBoxOpen}
                    editedPost={editedPost}
                    setEditedPost={setEditedPost}
                    editboxPreviewImg={editboxPreviewImg}
                    setEditPreviewImg={setEditPreviewImg}
                    setEditedImgContent={setEditedImgContent}
                    handleEdit={handleEdit}
                    handleUpdate={handleUpdate}
                  />
                ) : null
              )
            ) : (
              <h3>No post yet</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
