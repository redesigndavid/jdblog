import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Layout from "./components/Layout";
import Test from "./Test";
import PostLayout from "./components/PostLayout.jsx";
import PostsLayout from "./components/PostsLayout.jsx";
import TagPostsLayout from "./components/TagPostsLayout.jsx";
import ThemeProvider from "./context/ThemeProvider";
import LoginProvider from "./context/LoginProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <LoginProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<App />} />
              <Route path="test" element={<Test />} />
              <Route path="tag/:tagName" element={<TagPostsLayout />} />
              <Route path="blog/:postId" element={<PostLayout />} />
              <Route path="blog" element={<PostsLayout />} />
            </Route>
          </Routes>
        </LoginProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
