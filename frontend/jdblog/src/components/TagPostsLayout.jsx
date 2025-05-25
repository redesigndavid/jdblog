import React from "react";
import GenericPostsLayout from "./GenericPostsLayout";
import { ApiContext } from "../context/ApiProvider";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

function TagPostLayout() {
  const { requester } = useContext(ApiContext);
  const [posts, setPosts] = useState(() => {
    return [];
  });

  const [tags, setTags] = useState(() => {
    return [];
  });

  const { tagName } = useParams();

  useEffect(() => {
    requester("get", `/tag/${tagName}`, null, false, (res) => {
      setPosts(res.data.articles);
    });
    requester("get", `/tag`, null, false, (tags) => {
      setTags(tags.data);
    });
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
