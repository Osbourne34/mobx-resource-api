import { Button, Spin, Alert, Typography, Input, Flex } from 'antd'
import { usePostsStore } from '../../pages/posts/posts-context'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'

export const Posts = observer(() => {
  const postsStore = usePostsStore()
  const { push } = useHistory()

  const data = postsStore.posts.data
  const isLoading = postsStore.posts.isLoading
  const isError = postsStore.posts.isError
  const refetch = postsStore.posts.refetch

  return (
    <>
      <h1>Posts</h1>

      <Button onClick={refetch} style={{ marginBottom: '10px' }}>
        Refetch Posts
      </Button>

      <Typography.Text>{postsStore.multiplyCounter()}</Typography.Text>
      <Input
        placeholder="Search"
        value={postsStore.search}
        onChange={(e) => {
          postsStore.setSearch(e.target.value)
        }}
        style={{ marginBottom: '10px' }}
      />

      {isLoading && <Spin />}
      {isError && <Alert showIcon message="Error" type="error" />}
      {!isLoading && !isError && (
        <Flex vertical gap="small">
          {data?.map((post) => (
            <Flex
              justify="space-between"
              style={{ border: '1px solid #ccc', padding: '8px' }}
              key={post.id}
            >
              <Flex gap="small">
                <Typography.Text>{post.title}</Typography.Text> |
                <Typography.Text>{post.body}</Typography.Text>
              </Flex>
              <Button
                onClick={() => {
                  push(`/posts/${post.id}`)
                }}
              >
                Post
              </Button>
            </Flex>
          ))}
        </Flex>
      )}
    </>
  )
})
