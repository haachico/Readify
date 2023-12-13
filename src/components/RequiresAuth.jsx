import React, { useContext } from "react";
import { Navigate } from "react-router";
import { LoginProvider } from "../useContext/LoginContext";

function RequiresAuth({ children }) {
  const { isLogin } = useContext(LoginProvider);
  return isLogin ? children : <Navigate to="/login" />;
}

export default RequiresAuth;
