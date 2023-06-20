import React from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

function HomeLayout() {
  return (
    <div style={{ textAlign: "center", margin: "3rem 3rem 3rem 0rem" }}>
      <Link to="/" style={{ margin: "0 8rem" }}>
        Latest
      </Link>
      <span>|</span>
      <Link to="/trending" style={{ margin: "0 10rem" }}>
        Trending
      </Link>
      <Outlet />
    </div>
  );
}

export default HomeLayout;
