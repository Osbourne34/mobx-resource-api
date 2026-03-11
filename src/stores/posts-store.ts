import { action, makeObservable, observable } from 'mobx'
import { api } from '../api/api'
import { ResourceStore } from './utils/resource-store'
import { AsyncAction } from './utils/action'

export class PostsStore {
  @observable search: string = ''
  @observable selectedUserId: string | null = null

  posts = new ResourceStore({
    params: () => ({
      ['title:contains']: this.search,
      userId: this.selectedUserId,
    }),
    queryFn: ({ signal, params }) => {
      return api.posts({ signal, params })
    },
    mapper: (payload) => {
      return payload.map((item) => {
        return {
          ...item,
          uuid: crypto.randomUUID(),
        }
      })
    },
    enabled: () => Boolean(this.selectedUserId),
  })

  users = new ResourceStore({
    queryFn: ({ signal }) => {
      return api.users({ signal })
    },
    onSuccess: (response) => {
      this.setSelectedUser(response[0].id.toString())
    },
    onError: (error) => {
      console.log(error)
    },
  })

  createPost = new AsyncAction({
    actionFn: api.createPost,
    onSuccess: this.posts.refetch,
  })

  deletePost = new AsyncAction({
    actionFn: api.deletePost,
    onSuccess: this.posts.refetch,
  })

  constructor() {
    makeObservable(this)
  }

  @action
  setSearch = (search: string) => {
    this.search = search
  }

  @action
  setSelectedUser = (userId: string | null) => {
    this.selectedUserId = userId
  }
}
