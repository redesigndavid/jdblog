export {data};

import { API } from "/requester";
async function data(pageContext) {


  const { id } = pageContext.routeParams;
  const resp = await API.get(`/article/post/${id}`)

  const post = resp.data;
  const comments = resp.data.comments;
  const title = `redesigndavid.com - ${resp.data.title}`

  return { post, comments, title };
}
