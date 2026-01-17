import React, { useContext } from "react";
import { Navigate } from "react-router";
import { LoginProvider } from "../useContext/LoginContext";

function RequiresAuth({ children }) {
  const { isLogin, isLoading } = useContext(LoginProvider);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return isLogin ? children : <Navigate to="/login" />;
}

export default RequiresAuth;
