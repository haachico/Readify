import readify from "../logo.png";

import React, { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { LoginProvider } from "..";

function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const {
    setIsLogin,

    setEncodedToken,

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

  const navigate = useNavigate();

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
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(loggedInUserDetails, "LOGGED IN USER DETAILS");

  return (
    <div className="landing--div">
      <div className="login--form">
        <h1>Log In.</h1>
        <form>
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
