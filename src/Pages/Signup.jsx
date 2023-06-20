import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useContext } from "react";
import { LoginProvider } from "..";
import appImg from "../Assets/readify.png";

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
          firstNamme: firstName,
          lastName: lastName,
          username: username,
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
      <div>
        <img src={appImg} alt="App img" />
      </div>
      <div className="form--div">
        <form>
          <label>
            Enter your first name :
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>
            Enter your last name :
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label>
            Enter your username :
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Enter an email :
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Enter password :
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button onClick={handleSignup}>Sign up</button>
        </form>
        <div>
          <h4>{message}</h4>
          <span>Already have an account? </span>
          <Link to="/" style={{ color: "white" }}>
            Log In!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
