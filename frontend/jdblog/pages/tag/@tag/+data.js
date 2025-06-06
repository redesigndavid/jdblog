export { data };

import { API } from "/requester";
import { useConfig } from "vike-react/useConfig";

async function data(pageContext) {
  const config = useConfig();
  const tag = pageContext.routeParams.tag;
  const resp = await API.get(`/tag/${tag}`);
  const posts = resp.data.articles;
  posts.sort(
    (b, a) =>
      new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
  );

  const respTags = await API.get("/tag");

  const tags = respTags.data;
  const title = `${posts.length} Posts tagged with "${tag}"`;

  config({
    title: title,
  });
  return { posts, tags, title };
}
