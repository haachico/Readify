import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useContext } from "react";
import { LoginProvider } from "..";
import appImg from "../logo.png";
import { API_BASE_URL, authAPI } from "../utils/api";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
      });

      const result = await response.json();

      if (response.ok) {
        // After signup, fetch the user's profile data
        const profileResponse = await fetch(`${API_BASE_URL}/api/users/${result.createdUser.username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: result.encodedToken,
          },
        });
        
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
