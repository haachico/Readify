import React from "react";

const AvatarSelection = ({ setProfileImg }) => {
  const avatarOptions = [
    "https://www.svgrepo.com/show/382109/male-avatar-boy-face-man-user-7.svg",
    "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-female-black-6-512.png",
    "https://marketplace.canva.cn/iUe-w/MAFaIiiUe-w/1/tl/canva-MAFaIiiUe-w.png" /* Add more avatar names here */,
  ];

  return (
    <div style={{ display: "flex" }}>
      {avatarOptions.map((avatar) => (
        <div onClick={() => setProfileImg(avatar)}>
          <img src={avatar} alt="avatar" className="avatar" />
        </div>
      ))}
    </div>
  );
};

export default AvatarSelection;
