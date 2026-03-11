import { useParams } from 'react-router-dom'
import { Post } from '../../components/post/post'
import { useMemo } from 'react'
import { PostProvider } from './post-context'
import { PostStore } from '../../stores/post-store'

export const PostPage = () => {
  const { id } = useParams<{ id: string }>()
  const postStore = useMemo(() => new PostStore(id), [id])

  return (
    <PostProvider value={postStore}>
      <Post />
    </PostProvider>
  )
}





