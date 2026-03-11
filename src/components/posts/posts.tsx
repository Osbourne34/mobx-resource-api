import { Button, Spin, Alert, Typography, Input, Flex, Select } from 'antd'
import { usePostsStore } from '../../pages/posts/posts-context'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'

export const Posts = observer(() => {
  const postsStore = usePostsStore()
  const { push } = useHistory()

  const posts = postsStore.posts.data
  const isLoadingPosts = postsStore.posts.isLoading
  const isErrorPosts = postsStore.posts.isError
  const refetchPosts = postsStore.posts.refetch

  const users = postsStore.users.data
  const isLoadingUsers = postsStore.users.isLoading

  return (
    <div>
      <h1>Posts</h1>

      <Button onClick={refetchPosts} style={{ marginBottom: '10px' }}>
        Refetch Posts
      </Button>
      <Button
        loading={postsStore.createPost.isLoading}
        type="primary"
        onClick={async () => {
          const data = await postsStore.createPost.action({
            body: '123',
            title: 'test',
            userId: 1,
            id: crypto.randomUUID(),
          })
          console.log(data, 'result action')
        }}
      >
        Create Post
      </Button>
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

      {isLoadingPosts && <Spin />}
      {isErrorPosts && <Alert showIcon message="Error" type="error" />}
      {!isLoadingPosts && !isErrorPosts && (
        <Flex vertical gap="small">
          {posts?.map((post) => (
            <Flex
              justify="space-between"
              style={{ border: '1px solid #ccc', padding: '8px' }}
              key={post.id}
            >
              <Flex gap="small">
                <Typography.Text>{post.title}</Typography.Text> |
                <Typography.Text>{post.body}</Typography.Text>
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
                  onClick={() => {
                    postsStore.deletePost.action(post.id)
                  }}
                >
                  Delete
                </Button>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </div>
  )
})
