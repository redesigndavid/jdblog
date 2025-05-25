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
    requester("get", "/article/post", null, false, (post) => {
      setPosts(post.data);
    });
    requester("get", "/tag", null, false, (tags) => {
      setTags(tags.data);
    });
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
