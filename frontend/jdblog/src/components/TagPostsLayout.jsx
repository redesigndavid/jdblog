import React from "react";
import axios from "axios";
import GenericPostsLayout from "./GenericPostsLayout";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

function TagPostLayout() {
  const [posts, setPosts] = useState(() => {
    return [];
  });

  const [tags, setTags] = useState(() => {
    return [];
  });

  const { tagName } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8000/tag/${tagName}`).then((res) => {
      setPosts(res.data.posts);
    }, []);
    axios.get(`http://localhost:8000/tag`).then((tags) => {
      setTags(tags.data);
    }, []);
  }, []);

  return (
    <GenericPostsLayout
      posts={posts}
      tags={tags}
      title={`${posts.length} Posts tagged with \`${tagName}\``}
    />
  );
}

export default TagPostLayout;
