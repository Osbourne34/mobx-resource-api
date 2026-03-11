import { observer } from 'mobx-react'
import { usePostStore } from '../../pages/post/post-context'
import { Alert, Flex, Spin, Typography } from 'antd'

export const Post = observer(() => {
  const postStore = usePostStore()

  const post = postStore.post.data
  const isLoadingPost = postStore.post.isLoading
  const isErrorPost = postStore.post.isError

  const commnets = postStore.comments.data
  const isLoadingComments = postStore.comments.isLoading
  const isErrorComments = postStore.comments.isError

  return (
    <div>
      <h1>Post</h1>

      {isLoadingPost && <Spin />}
      {isErrorPost && <Alert showIcon message="Error" type="error" />}
      {!isLoadingPost && !isErrorPost && (
        <div>
          <Flex vertical gap="small">
            <Typography.Text>ID: {post?.id}</Typography.Text>
            <Typography.Text>Title: {post?.title}</Typography.Text>
            <Typography.Text>Body: {post?.body}</Typography.Text>
            <Typography.Text>userID: {post?.userId}</Typography.Text>
          </Flex>

          <h2>Comments:</h2>
          {isLoadingComments && <Spin />}
          {isErrorComments && <Alert showIcon message="Error" type="error" />}
          {!isLoadingComments &&
            !isErrorComments &&
            commnets?.map((comment) => {
              return (
                <Flex vertical key={comment.id}>
                  <Typography.Text>User: {comment.name}</Typography.Text>
                  <Typography.Text style={{ marginLeft: '40px' }}>
                    Comment: {comment.body}
                  </Typography.Text>
                </Flex>
              )
            })}
        </div>
      )}
    </div>
  )
})
