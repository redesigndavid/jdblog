import React from "react";

import { ApiContext } from "../context/ApiProvider";
import { LoginContext } from "../context/LoginProvider";
import GenericPostsLayout from "./GenericPostsLayout";
import { useState, useEffect, useContext } from "react";

function PostsLayout() {
  const { requester } = useContext(ApiContext);
  const { isAdmin } = useContext(LoginContext);
  const [posts, setPosts] = useState(() => {
    return [];
  });

  const [tags, setTags] = useState(() => {
    return [];
  });

  useEffect(() => {
    const payload = !isAdmin && { status: "published" } || null;

    requester("post", "/article/post", payload, false, (post) => {
      setPosts(post.data);
    });
    requester("get", "/tag", null, false, (tags) => {
      setTags(tags.data);
    });
  }, [isAdmin]);

  return (
    <GenericPostsLayout
      posts={posts}
      tags={tags}
      title={`${posts.length} Posts`}
    />
  );
}

export default PostsLayout;
