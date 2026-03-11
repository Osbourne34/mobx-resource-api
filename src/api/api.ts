import axios, { type AxiosRequestConfig } from 'axios'

const baseURL = 'http://localhost:4333'
const axiosInstanse = axios.create({
  baseURL,
})

export const api = {
  posts: async (axiosConfig?: AxiosRequestConfig) => {
    const { data } = await axiosInstanse<Post[]>({
      ...axiosConfig,
      url: 'posts',
    })

    return data
  },

  postById: async (id: string, axiosConfig?: AxiosRequestConfig) => {
    const { data } = await axiosInstanse<Post>({
      ...axiosConfig,
      url: `posts/${id}`,
    })

    return data
  },

  commentsByPostId: async (
    postId: number,
    axiosConfig?: AxiosRequestConfig,
  ) => {
    const { data } = await axiosInstanse<Comment[]>(
      `comments?postId=${postId}`,
      axiosConfig,
    )

    return data
  },

  users: async () => {
    const { data } = await axiosInstanse<User[]>({
      url: 'users',
    })

    return data
  },
}

type Post = {
  id: number
  userId: number
  title: string
  body: string
}

type Comment = {
  id: number
  postId: number
  name: string
  body: string
}

type User = {
  id: number
  name: string
  email: string
}
