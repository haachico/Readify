import readify from "../Assets/logo.png";

import React, { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { LoginProvider } from "..";

function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const {
    isLogin,
    setIsLogin,
    encodedToken,
    setEncodedToken,
    userID,
    setUserID,
    username,
    firstName,
    lastName,
    loggedInUserDetails,
    setLoggedInUserDetails,
    profileImg,
    about,
    link,
  } = useContext(LoginProvider);

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      const response = await fetch("/api/auth/login", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          firstName: firstName,
          lastName: lastName,
          image: profileImg,
          about: about,
          link: link,
        }),
      });

      const result = await response.json();
      console.log("Success:", result);
      setLoggedInUserDetails(result.foundUser);
      if (result.errors) {
        setErrMsg("User not found!");
      } else {
        setIsLogin(true);
        setEncodedToken(result.encodedToken);
        setUserID(result.id);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(loggedInUserDetails, "LOGGED IN USER DETAILS");

  return (
    <div className="landing--div">
      <div className="login--form">
        <form>
          <label>Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password : </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Submit</button>
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
