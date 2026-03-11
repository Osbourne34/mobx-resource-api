import { makeObservable } from 'mobx'
import { ResourceStore } from './utils/resource-store'
import { api } from '../api/api'

export class PostStore {
  postId: string = ''

  post = new ResourceStore({
    queryFn: ({ signal }) => {
      return api.postById(this.postId, { signal })
    },
  })

  comments = new ResourceStore({
    queryFn: ({ signal }) => {
      return api.commentsByPostId(this.post.data!.id, { signal })
    },
    enabled: () => !!this.post.data?.id,
  })

  constructor(postId: string) {
    this.postId = postId
    makeObservable(this)
  }
}
