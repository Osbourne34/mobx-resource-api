import { action, computed, makeAutoObservable } from 'mobx'
import { api } from '../api/api'
import { ResourceStore } from './utils/resource-store'
import { globalCounterStore } from './global-counter-store'

export class PostsStore {
  search: string = ''

  posts = new ResourceStore({
    params: () => ({
      ['title:contains']: this.search,
    }),
    queryFn: ({ signal, params }) => {
      return api.posts({ signal, params })
    },
  })

  constructor() {
    makeAutoObservable(this)
  }

  @action
  setSearch = (search: string) => {
    this.search = search
  }

  @computed
  multiplyCounter() {
    return globalCounterStore.counter * 2
  }
}
