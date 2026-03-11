import { makeAutoObservable } from 'mobx'
import { ResourceStore } from './utils/resource-store'
import { api } from '../api/api'

export class PostStore {
  postId: string = ''
  selectValue: string | null = null

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
    makeAutoObservable(this)
  }
}
