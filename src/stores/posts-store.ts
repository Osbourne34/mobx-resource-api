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
    initState: [],
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

  deletePost = new AsyncAction({
    actionFn: api.deletePost,
    onSuccess: this.posts.refetch,
  })

  click = async () => {
    const posts = await this.posts.refetch()
    console.log(posts?.map((item) => item.userId))
  }

  createPost = async () => {
    this.createPostAction.action({
      body: '123',
      title: 'test',
      userId: 1,
      id: crypto.randomUUID(),
    })
  }

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
