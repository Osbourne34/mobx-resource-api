import { makeObservable } from 'mobx'
import { QueryManager } from './utils/query-manager'
import { api } from '../api/api'

export class PostStore {
  postId: string = ''

  post = new QueryManager({
    queryFn: ({ signal }) => {
      return api.postById(this.postId, { signal })
    },
  })

  comments = new QueryManager({
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
