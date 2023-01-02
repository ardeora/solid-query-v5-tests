import {
  Component,
  createEffect,
  createSignal,
  Show,
  Suspense,
} from "solid-js";
import styles from "./App.module.css";

import {
  createQuery,
  defaultContext,
} from "../../query/packages/solid-query/src";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const App: Component = () => {
  const [posts, setPosts] = createSignal(1);

  return (
    <div class={styles.App}>
      <p>Post ID: {posts()}</p>

      <button onClick={() => setPosts(posts() + 1)}>Increment</button>
      <button onClick={() => setPosts(posts() - 1)}>Decrement</button>
      <Suspense fallback={<div>Suspended...</div>}>
        <Wrapper posts={posts()} />
      </Suspense>
    </div>
  );
};

const Wrapper: Component<{ posts: number }> = (props) => {
  const postsQuery = createQuery(() => ({
    queryKey: ["posts", props.posts],
    queryFn: async ({ queryKey }) => {
      const [key, id] = queryKey;
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/" + id
      );
      const data = await response.json();
      return data as Post;
    },
    select(data) {
      return data.title;
    },
    enabled: props.posts > 0,
  }));

  createEffect(() => {
    console.log("postsQuery", postsQuery.data);
  });

  return (
    <div>
      {postsQuery.isLoading && <div>Loading...</div>}
      <Show when={postsQuery.data} keyed>
        {(title) => <div>{title}</div>}
      </Show>
    </div>
  );
};
export default App;
