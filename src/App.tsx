import { Alert, Button, Modal, Spin } from "antd";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import { ResourceStore } from "./stores/resourceStore";
import { api } from "./api/api";

import { Link, Route, Router, Switch, useParams } from "react-router-dom";
import { routerStore } from "./stores/RouterStore";

const HomePage = () => {
  return <h1>Home Page</h1>;
};

const ProjectsPage = () => {
  return (
    <div>
      <h1>Projects</h1>
      <div>
        <Link to="/projects/123">Project 1</Link>
      </div>
      <Link to="/projects/312">Project 2</Link>
    </div>
  );
};

const ProjectPage = () => {
  const [open, setOpen] = useState(false);

  const params = useParams<{ id: string }>();

  const click = () => {
    const modalId = modalsStore.open({
      title: "yes",
      children: <div></div>,
    });
  };

  return (
    <div>
      <Link to="/projects">back Projects</Link>
      <h1>Project Page {params.id}</h1>

      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onCancel={() => setOpen(false)} destroyOnHidden={true}>
        <ModalContent />
      </Modal>
    </div>
  );
};

const NotFoundPage = () => {
  return <h1>Not Found 404</h1>;
};

export const App = observer(() => {
  return (
    <Router history={routerStore.history}>
      <div>
        <Link to="/">Home</Link>
        <Link to="projects">Projects</Link>
      </div>

      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            return <HomePage />;
          }}
        />
        <Route exact path="/projects" component={ProjectsPage} />
        <Route
          path="/projects/:id"
          render={() => {
            return <ProjectPage />;
          }}
        />

        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Router>
  );
});

class PostsStore {
  projectId: string | undefined = "";
  posts = new ResourceStore({
    queryFn: ({ signal }) => api.postById(this.projectId, { signal }),
  });

  constructor(projectId?: string) {
    this.projectId = projectId;
    makeAutoObservable(this);
  }
}

const ModalContent = observer(() => {
  const { id } = useParams<{ id: string }>();
  const postsStore = useMemo(() => new PostsStore(id), []);

  const { data, isError, isLoading, fetch } = postsStore.posts.result();

  return (
    <Provider>
      <div>
        {isLoading && <Spin />}
        {isError && <Alert showIcon message="Error" type="error" />}
        {!isLoading && (
          <Button
            onClick={() => {
              fetch();
            }}
          >
            Refetch
          </Button>
        )}
        {data && <div>Post: {(data.title, data.id)}</div>}
      </div>
    </Provider>
  );
});

const { Provider } = createStoreContext(PostsStore);
