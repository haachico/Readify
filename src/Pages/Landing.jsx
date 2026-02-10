import readify from "../logo.png";

import React, { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { LoginProvider } from "..";
import { API_BASE_URL, authAPI } from "../utils/api";

function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const {
    setIsLogin,
    setEncodedToken,
    setUserID,
    setUsername,
    setFirstName,
    setLastName,
    // setEmail,
    setProfileImg,
    setAbout,
    setLink,
    setFollowedUsers,
    loggedInUserDetails,
    setLoggedInUserDetails,
  } = useContext(LoginProvider);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      console.log("Form submitted, email:", email, "password:", password);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: 'include', // Send cookies for refresh token
      });

      const result = await response.json();
      console.log("Login response:", result);

      console.log(result, "result")

      if (result.foundUser) {
        // Store the full user object
        setLoggedInUserDetails(result.foundUser);
        // Also update individual context states
        setFirstName(result.foundUser.firstName);
        setLastName(result.foundUser.lastName);
        setEmail(result.foundUser.email);
        setUsername(result.foundUser.username);
        setUserID(result.foundUser.id);
        setProfileImg(result.foundUser.profileImage || "https://img.freepik.com/free-icon/user_318-159711.jpg");
        setAbout(result.foundUser.about || "");
        setLink(result.foundUser.link || "");
        setFollowedUsers(result.foundUser.followings || []);
        // Set token and login
        setEncodedToken(result.encodedToken);
        setIsLogin(true);
        navigate("/");
      } else {
        setErrMsg(result.message || "User not found!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrMsg("Error during login!");
    }
  };

  console.log(loggedInUserDetails, "LOGGED IN USER DETAILS");

  return (
    <div className="landing--div">
      <div className="login--form">
        <h1>Log In.</h1>
        <form onSubmit={handleLogin}>
          <label for="email">Email or Username: </label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Enter your email or username"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label for="password">Password : </label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Submit</button>
        </form>
        <h4>{errMsg}</h4>
        <span>Don't have an account? </span>
        <span>
          <Link
            to="/signup"
            style={{ color: "white", textDecoration: "underline" }}
          >
            Sign up!
          </Link>
        </span>
      </div>
      <div className="login--logoImg">
        <img src={readify} alt="" />
      </div>
    </div>
  );
}

export default Landing;
