import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Layout from "./components/Layout";
import BlogLayout from "./components/BlogLayout";
import Test from "./Test";
import ThemeProvider from "./context/ThemeProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout sidebar={false}/>}>
            <Route index element={<App />} />
          </Route>
          <Route path="/" element={<Layout sidebar={true}/>}>
            <Route element={<BlogLayout />}>
              <Route path="test" element={<Test />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
