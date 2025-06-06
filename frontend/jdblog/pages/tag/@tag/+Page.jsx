export default Page;

import GenericPostsLayout from "@components/GenericPostsLayout";
import { usePageContext } from 'vike-react/usePageContext'

function Page() {
  const pageContext = usePageContext()
  const {tags, posts, title} = pageContext.data;

  return <GenericPostsLayout
      posts={posts}
      tags={tags}
      title={title}
    />
}
