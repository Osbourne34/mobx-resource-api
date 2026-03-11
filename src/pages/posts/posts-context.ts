import type { PostsStore } from "../../stores/posts-store";
import { createContextFactory } from "../../utils/create-context-factory";

export const { provider: PostsProvider, useContext: usePostsStore } =
  createContextFactory<PostsStore>();
