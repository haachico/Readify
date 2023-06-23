import "./index";
import Mockman from "mockman-js";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";

import { LoginProvider } from "./index";
import Landing from "./Pages/Landing";
import Signup from "./Pages/Signup";
import Layout from "./components/Layout";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import BookmarkPosts from "./Pages/BookmarkPosts";
import HomeLayout from "./components/HomeLayout";
import Trending from "./Pages/Trending";
import Profile from "./Pages/Profile";

function App() {
  const { isLogin, isPostboxOpen } = useContext(LoginProvider);
  return (
    <div className={`App  ${isPostboxOpen ? "blur" : ""}`}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        {isLogin && (
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<HomeLayout />}>
              <Route index element={<Home />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/bookmark" element={<BookmarkPosts />} />
            </Route>
            <Route path="/profile/:profileID" element={<Profile />} />
            <Route path="/mockman" element={<Mockman />} />
          </Route>
        )}
      </Routes>
    </div>
  );
}

export default App;
