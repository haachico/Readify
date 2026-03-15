import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// import { makeServer } from "./server";  // Disabled - using real backend now

import { LoginProvider, LoginContext } from "./useContext/LoginContext";

export { LoginProvider };

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// Call make Server
// makeServer();  // Disabled - using real backend now

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <LoginContext>
            <App />
          </LoginContext>
        </GoogleOAuthProvider>
      ) : (
        <LoginContext>
          <App />
        </LoginContext>
      )}
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
