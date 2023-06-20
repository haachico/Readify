import readify from "../Assets/readify.png";

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
          image: "",
        }),
      });

      const result = await response.json();
      console.log("Success:", result);

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

  return (
    <div className="landing--div">
      <div>
        <form>
          <label>
            Enter your email:
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
          <button onClick={handleLogin}>Submit</button>
        </form>
        <h4>{errMsg}</h4>
        <span>Don't have an account? </span>
        <span>
          <Link to="/signup" style={{ color: "white" }}>
            Sign up!
          </Link>
        </span>
      </div>
      <div>
        <img src={readify} alt="" />
      </div>
    </div>
  );
}

export default Landing;
