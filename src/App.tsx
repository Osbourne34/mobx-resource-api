import { Link, Route, Switch, BrowserRouter } from 'react-router-dom'
import { HomePage } from './pages/home'

import { NotFoundPage } from './pages/404'

import { Flex } from 'antd'
import { PostsPage } from './pages/posts/posts'
import { PostPage } from './pages/post/post'

export const App = () => {
  return (
    <BrowserRouter>
      <Flex gap="middle">
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link>
      </Flex>

      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/posts">
          <PostsPage />
        </Route>
        <Route path="/posts/:id">
          <PostPage />
        </Route>

        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
