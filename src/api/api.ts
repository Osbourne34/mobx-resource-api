import axios, { type AxiosRequestConfig } from "axios";

const baseURL = "http://localhost:3000";
const axiosInstanse = axios.create({
  baseURL,
});

export const api = {
  posts: async (axiosConfig?: AxiosRequestConfig) => {
    const data = await axiosInstanse<Post[]>({
      ...axiosConfig,
      url: "posts",
    });

    return data.data;
  },

  postById: async (id?: string, axiosConfig?: AxiosRequestConfig) => {
    const data = await axiosInstanse<Post>({
      ...axiosConfig,
      url: `posts/${id}`,
    });

    return data.data;
  },

  users: async () => {
    const data = await axiosInstanse<User[]>({
      url: "users",
    });

    return data.data;
  },
};

type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

type User = {
  id: number;
  name: string;
  email: string;
};
