import { PostsStore } from '../../stores/posts-store'
import { Posts } from '../../components/posts/posts'
import { PostsProvider } from './posts-context'
import { useMemo } from 'react'

// const postsStore = new PostsStore()

export const PostsPage = () => {
  const postsStore = useMemo(() => new PostsStore(), [])

  return (
    <PostsProvider value={postsStore}>
      <Posts />
    </PostsProvider>
  )
}
