import React from "react";
import axios from "axios";
import GenericPostsLayout from "./GenericPostsLayout";
import { useState, useEffect } from "react";

function PostLayout() {
  const [posts, setPosts] = useState(() => {
    return [];
  });

  const [tags, setTags] = useState(() => {
    return [];
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/article/post`).then((res) => {
      setPosts(res.data);
    }, []);
    axios.get(`${import.meta.env.VITE_API_URL}/tag`).then((tags) => {
      setTags(tags.data);
    }, []);
  }, []);

  return (
    <GenericPostsLayout
      posts={posts}
      tags={tags}
      title={`${posts.length} Posts`}
    />
  );
}

export default PostLayout;
