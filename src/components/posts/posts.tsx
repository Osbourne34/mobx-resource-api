import {
  Button,
  Spin,
  Alert,
  Typography,
  Input,
  Flex,
  Select,
  Skeleton,
} from 'antd'
import { usePostsStore } from '../../pages/posts/posts-context'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'

export const Posts = observer(() => {
  const postsStore = usePostsStore()
  const { push } = useHistory()

  const posts = postsStore.posts.data
  const isLoadingPosts = postsStore.posts.isLoading
  const isInitialLoading = postsStore.posts.isInitialLoading
  const isErrorPosts = postsStore.posts.isError
  const refetchPosts = postsStore.posts.refetch

  const users = postsStore.users.data
  const isLoadingUsers = postsStore.users.isLoading

  const handleCreate = () => {
    postsStore.createPost()
  }

  const handleDelete = (id: number | string) => {
    postsStore.deletePost.action(id)
  }

  return (
    <div>
      <h1>Posts</h1>

      <Button onClick={refetchPosts} style={{ marginBottom: '10px' }}>
        Refetch Posts
      </Button>
      <Button
        loading={postsStore.createPostAction.isLoading}
        type="primary"
        onClick={handleCreate}
      >
        Create Post
      </Button>
      <Button onClick={() => postsStore.createLocalPost()}>
        Create Local Post
      </Button>
      <Button onClick={() => postsStore.clearPosts()}>Clear Posts</Button>
      <Flex gap="middle" style={{ marginBottom: '10px' }}>
        <Input
          placeholder="Search"
          value={postsStore.search}
          onChange={(e) => {
            postsStore.setSearch(e.target.value)
          }}
        />

        <Select
          placeholder="Select user"
          value={postsStore.selectedUserId}
          onChange={postsStore.setSelectedUser}
          style={{
            width: '300px',
          }}
          loading={isLoadingUsers}
          options={users?.map((user) => {
            return {
              value: user.id.toString(),
              label: user.name,
            }
          })}
        />
      </Flex>

      {(isInitialLoading || isLoadingUsers) && <Skeleton />}
      {isErrorPosts && <Alert showIcon message="Error" type="error" />}
      {!isInitialLoading && !isErrorPosts && (
        <Spin spinning={isLoadingPosts}>
          <Flex vertical gap="small">
            {posts?.map((post) => (
              <Flex
                justify="space-between"
                style={{ border: '1px solid #ccc', padding: '8px' }}
                key={post.id}
              >
                <Flex gap="small">
                  <Typography.Text>{post.title}</Typography.Text> |
                  <Typography.Text>{post.body}</Typography.Text>|
                  <Typography.Text>{post.uuid}</Typography.Text>
                </Flex>
                <Flex gap="small">
                  <Button
                    onClick={() => {
                      push(`/posts/${post.id}`)
                    }}
                  >
                    Post
                  </Button>
                  <Button
                    variant="filled"
                    color="danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Spin>
      )}
    </div>
  )
})
