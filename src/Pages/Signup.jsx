import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useContext } from "react";
import { LoginProvider } from "..";
import appImg from "../Assets/logo.png";

function Signup() {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    username,
    setUsername,
    profileImg,
    about,
    link,
  } = useContext(LoginProvider);

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    try {
      e.preventDefault();

      const response = await fetch("/api/auth/signup", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          username: username,
          image: profileImg,
          about: about,
          link: link,
        }),
      });

      console.log(username, "USERNAME");
      const result = await response.json();
      console.log("Success:", result);
      if (!response.errors) setMessage("You are signed up! Please log in!");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="signup--div">
      <div className="signup--logoImg">
        <img src={appImg} alt="App img" />
      </div>
      <div className="signup--form">
        <h1>Sign up</h1>
        <form>
          <label>First name : </label>
          <input
            type="text"
            value={firstName}
            placeholder="Enter your first name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label>Last name : </label>
          <input
            type="text"
            value={lastName}
            placeholder="Enter your last name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label> Username : </label>
          <input
            type="text"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Email : </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password : </label>
          <input
            type="password"
            value={password}
            placeholder="Enter a valid password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleSignup}>Sign up</button>
        </form>
        <div>
          <h4>{message}</h4>
          <span>Already have an account? </span>
          <Link to="/" style={{ color: "white", textDecoration: "underline" }}>
            Log In!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
