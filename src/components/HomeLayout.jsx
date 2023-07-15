import React from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import SuggestedUsers from "./SuggestedUsers";

function HomeLayout() {
  return (
    <div className="main--body">
      <Sidebar />
      <Outlet />
      <SuggestedUsers />
    </div>
  );
}

export default HomeLayout;
