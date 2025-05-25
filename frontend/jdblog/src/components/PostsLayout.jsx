import React from "react";

import { ApiContext } from "../context/ApiProvider";
import GenericPostsLayout from "./GenericPostsLayout";
import { useState, useEffect, useContext } from "react";

function PostLayout() {

  const { requester } = useContext(ApiContext);

  const [posts, setPosts] = useState(() => {
    return [];
  });

  const [tags, setTags] = useState(() => {
    return [];
  });

  useEffect(() => {
    requester("get", "/article/post").then((post) => {
      setPosts(post.data);
    }, []);
    requester("get", "/tag").then((tags) => {
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
