import React from "react";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { LoginProvider } from "..";
import appImg from "../logo.png";
import { API_BASE_URL, authAPI } from "../utils/api";
import { FaUser } from "react-icons/fa";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();
  const {
    setIsLogin,
    setEncodedToken,
    setUserID,
    setUsername: setContextUsername,
    setFirstName: setContextFirstName,
    setLastName: setContextLastName,
    setEmail: setContextEmail,
    setProfileImg,
    setAbout,
    setLink,
    setFollowedUsers,
    setLoggedInUserDetails,
  } = useContext(LoginProvider);

  const applyAuthenticatedUser = (result) => {
    if (!result?.foundUser || !result?.encodedToken) {
      setMessage("Authentication failed!");
      return;
    }

    setLoggedInUserDetails(result.foundUser);
    setContextFirstName(result.foundUser.firstName || "");
    setContextLastName(result.foundUser.lastName || "");
    setContextEmail(result.foundUser.email || "");
    setContextUsername(result.foundUser.username || "");
    setUserID(result.foundUser.id || "");
    setProfileImg(result.foundUser.profileImage || "https://img.freepik.com/free-icon/user_318-159711.jpg");
    setAbout(result.foundUser.about || "");
    setLink(result.foundUser.link || "");
    setFollowedUsers(result.foundUser.followings || []);
    setEncodedToken(result.encodedToken);
    setIsLogin(true);
    navigate("/");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName || !username) return;

    try {
      const response = await fetch(authAPI.signup, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          username: username,
        }),
        credentials: "include", // Send cookies for refresh token
      });

      const result = await response.json();

      if (response.ok) {
        // After signup, fetch the user's profile data
        const profileResponse = await fetch(
          `${API_BASE_URL}/api/users/${result.createdUser.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: result.encodedToken,
            },
          },
        );

        const profileData = await profileResponse.json();
        console.log("User profile data:", profileData);
        setMessage("You are signed up! Please log in!");
      } else {
        setMessage(result.error || "Signup failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error during signup!");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(authAPI.google, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        applyAuthenticatedUser(result);
        return;
      }

      setMessage(result.message || "Google signup failed!");
    } catch (error) {
      console.error("Google Signup Error:", error);
      setMessage("Error during Google signup!");
    }
  };

  return (
    <div className="signup--div">
      <div className="signup--logoImg">
        <img src={appImg} alt="App img" />
      </div>
      <div className="signup--form">
        <h1>Sign up</h1>
        {/* <FaUser size={50} style={{ marginBottom: "20px", color: "#333" }} /> */}
        <form>
          <div className="form-field">
            <label htmlFor="firstName">First name: </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              placeholder="Enter your first name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Last name : </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              placeholder="Enter your last name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="username"> Username : </label>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email : </label>
            <input
              type="email"
              id="email"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Enter a valid password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button onClick={handleSignup}>Sign up</button>
        </form>
        {googleClientId ? (
          <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setMessage("Google signup was cancelled or failed.")}
              useOneTap={false}
            />
          </div>
        ) : null}
        <div>
          <h4>{message}</h4>
          <span>Already have an account? </span>
          <Link
            to="/login"
            style={{ color: "white", textDecoration: "underline" }}
          >
            Log In!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
