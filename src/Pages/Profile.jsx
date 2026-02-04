import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import FadeLoader from "react-spinners/FadeLoader";

import { LoginProvider } from "..";
import Post from "../components/Post";
import UserProfile from "../components/UserProfile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../utils/api";

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
  const [selectedUser, setSelectedUser] = useState(null);

  const { profileName } = useParams();

  const handleEdit = (id) => {
    const post = posts?.find((e) => e?._id == id);

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
      // setEditedPostID("");
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


  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${profileName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
      });
      const result = await response.json();
      setSelectedUser(result.user);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    
    if (profileName) {
      fetchProfileData();
    }
  }, [profileName, encodedToken])
  
  const handleSaveEditForm = async (id) => {
    console.log("SUBMITEDDDD");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/updateProfile`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({
            profileImage: profileImg,
            about: about,
            link: link,
        }),
      });

      const result = await response.json();

      
      //updating only the user in allUsers array whose profile we updated, keeping other users intact
      // setAllUsers(
      //   allUsers?.map((user) =>
      //     user.username === result.user.username ? result.user : user
      //   )
      // );

      // Because we also have to update the profile image in posts
      // const postResponse = await fetch(`/api/posts/edit/${id}`, {
      //   method: "POST", // or 'PUT'
      //   headers: {
      //     "Content-Type": "application/json",
      //     authorization: encodedToken,
      //   },
      //   body: JSON.stringify({
      //     postData: {
      //       image: profileImg,
      //     },
      //   }),
      // });
      // const postResult = await postResponse.json();
      // setPosts(postResult.posts);
      setEditedPostID("");
      
      setIsEditFormOpen(false);
      toast.success("Profile updated!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsLoading(false);
      // Window.location.reload()
      fetchProfileData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowClick = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({ followingId: id }),
      });

      const result = await response.json();

      // Toggle: if already following, remove; else add
      setFollowedUsers(
        followedUsers.includes(id)
          ? followedUsers.filter(userId => userId !== id)
          : [...followedUsers, id]
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollowClick = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: encodedToken,
        },
        body: JSON.stringify({ followingId: id }),
      });

      const result = await response.json();

      // Toggle: if already following, remove; else add
      setFollowedUsers(
        followedUsers.includes(id)
          ? followedUsers.filter(userId => userId !== id)
          : [...followedUsers, id]
      );
    } catch (err) {
      console.error(err);
    }
  };

  const sortedPosts = posts?.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return dateB - dateA;
  });

  const postUpdateProfileId = posts?.find(
    (e) => e.username == selectedUser?.username
  )?._id;

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
          {selectedUser && (
          <UserProfile
            userId={selectedUser.id}
            firstName={selectedUser.firstName}
            lastName={selectedUser.lastName}
            image={selectedUser.profileImage}
            userName={selectedUser.username}
            aboutUser={selectedUser.about}
            setAbout={setAbout}
            bioLink={selectedUser.link}
            setLink={setLink}
            followings={selectedUser.followings}
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
          )}
          <div className="posts--div">
            {sortedPosts?.map((e) =>
              e?.username === profileName ? (
                <Post
                  postId={e?._id}
                  postUsername={e?.username}
                  image={e?.image}
                  firstName={e?.firstName}
                  lastName={e?.lastName}
                  content={e?.content}
                  imgContent={e?.imgContent}
                  likesCount={e?.likes.likeCount}
                  commentsCount={e?.commentCount}
                  createdAt={e?.createdAt}
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
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Profile;
