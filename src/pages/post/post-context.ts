import type { PostStore } from '../../stores/post-store'
import { createContextFactory } from '../../utils/create-context-factory'

export const { provider: PostProvider, useContext: usePostStore } =
  createContextFactory<PostStore>()
