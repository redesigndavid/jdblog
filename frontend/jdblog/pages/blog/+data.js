export { data };

import { API } from "/requester";

import { useConfig } from "vike-react/useConfig";

async function data(pageContext) {
  const config = useConfig();

  const resp = await API.post("/article/post", { status: "published" });
  resp.data.sort(
    (b, a) =>
      new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
  );

  const posts = resp.data;
  const respTags = await API.get("/tag");
  const tags = respTags.data;

  config({
    title: "redesingdavid.com - blog",
  });

  return { posts, tags };
}
