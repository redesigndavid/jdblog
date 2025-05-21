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
    axios.get(`http://localhost:8000/post`).then((res) => {
      setPosts(res.data);
    }, []);
    axios.get(`http://localhost:8000/tag`).then((tags) => {
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
