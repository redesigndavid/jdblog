export default Page;
import GenericPostsLayout from "@components/GenericPostsLayout";
import { usePageContext } from 'vike-react/usePageContext'

function Page() {

  const pageContext = usePageContext()
  const {tags, posts} = pageContext.data;
  const title = `${posts.length} Posts`

  return <GenericPostsLayout
      posts={posts}
      tags={tags}
      title={title}
    />
}

