export { data };
import { API } from "../../requester";

async function data(pageContext) {
  const resp = await API.post("/article/post", { status: "published" });
  resp.data.sort(
    (b, a) =>
      new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
  );

  const posts = resp.data;
  resp.data.sort((b, a) => a.visits.length - b.visits.length);
  const popPosts = resp.data;
  const respTags = await API.get("/tag");
  const tags = respTags.data;

  return { posts, popPosts, tags };
}
