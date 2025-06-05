export { data };

import { API } from "/requester";

async function data(pageContext) {
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
  return { posts, tags, title };
}
