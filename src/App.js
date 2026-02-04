import "./index";
import Mockman from "mockman-js";
import { Routes, Route } from "react-router-dom";
// import { useContext } from "react";

// import { LoginProvider } from "./index";
import Landing from "./Pages/Landing";
import Signup from "./Pages/Signup";
import Layout from "./components/Layout";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import BookmarkPosts from "./Pages/BookmarkPosts";
import HomeLayout from "./components/HomeLayout";
import Trending from "./Pages/Trending";
import Profile from "./Pages/Profile";
import RequiresAuth from "./components/RequiresAuth";
import ErrorPage from "./Pages/ErrorPage";
import PostDetails from "./Pages/PostDetails";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <RequiresAuth>
              <Layout />
            </RequiresAuth>
          }
        >
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path="trending" element={<Trending />} />
            <Route path="explore" element={<Explore />} />
            <Route path="bookmark" element={<BookmarkPosts />} />
            <Route path="profile/:profileName" element={<Profile />} />
            <Route path="post/:postId" element={<PostDetails />} />
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage />} />
        <Route path="/mockman" element={<Mockman />} />
      </Routes>
    </div>
  );
}

export default App;
