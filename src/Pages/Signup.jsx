import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useContext } from "react";
import { LoginProvider } from "..";
import appImg from "../logo.png";

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
    if (!email || !password || !firstName || !lastName || !username) return;

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
          <label for="firstName">First name : </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            placeholder="Enter your first name"
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label for="lastName">Last name : </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            placeholder="Enter your last name"
            onChange={(e) => setLastName(e.target.value)}
          />

          <label for="username"> Username : </label>
          <input
            type="text"
            id="username"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label for="email">Email : </label>
          <input
            type="email"
            id="email"
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label for="password">Password : </label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Enter a valid password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleSignup}>Sign up</button>
        </form>
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
