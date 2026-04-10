import { action, makeObservable, observable } from 'mobx'
import { api } from '../api/api'
import { QueryManager } from './utils/query-manager'
import { AsyncAction } from './utils/action'
import { AbortError } from './utils/abort-error'

export class PostsStore {
  @observable search: string = ''
  @observable selectedUserId: string | null = null

  posts = new QueryManager({
    params: () => ({
      ['title:contains']: this.search,
      userId: this.selectedUserId,
    }),
    queryFn: async ({ signal, params }) => {
      if (!params?.userId) {
        throw new AbortError('no userId')
      }

      return await api.posts({ signal, params })
    },
    mapper: (payload) => {
      return payload.map((item) => {
        return {
          ...item,
          uuid: crypto.randomUUID(),
        }
      })
    },
    initState: [],
  })

  users = new QueryManager({
    queryFn: ({ signal }) => {
      return api.users({ signal })
    },
    onSuccess: (response) => {
      this.setSelectedUser(response[0].id.toString())
    },
  })

  @action
  setSearch = (search: string) => {
    this.search = search
  }

  @action
  setSelectedUser = (userId: string | null) => {
    this.selectedUserId = userId
  }

  createPostAction = new AsyncAction({
    actionFn: api.createPost,
    onSuccess: this.posts.refetch,
  })

  clearPosts = () => {
    this.posts.setData([])
  }

  createLocalPost = () => {
    this.posts.setData((prev) => {
      return [
        ...(prev ?? []),
        { body: '1', id: crypto.randomUUID(), title: 'test', userId: 555 },
      ]
    })
  }

  updatePostAction = new AsyncAction({
    actionFn: api.updatePost,
    onSuccess: this.posts.refetch,
  })

  deletePost = new AsyncAction({
    actionFn: api.deletePost,
    onSuccess: this.posts.refetch,
  })

  constructor() {
    makeObservable(this)
  }
}
