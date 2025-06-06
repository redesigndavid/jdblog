export {data};

import { API } from "/requester";
import { useConfig } from 'vike-react/useConfig'

async function data(pageContext) {

  const config = useConfig()


  const { id } = pageContext.routeParams;
  const resp = await API.get(`/article/post/${id}`)

  const post = resp.data;
  const comments = resp.data.comments;
  const title = `redesigndavid.com - ${resp.data.title}`

  config({
    title: title,
    description: (resp.data.exceprt + resp.data.title).slice(0, 160),
  })

  return { post, comments, title };
}
