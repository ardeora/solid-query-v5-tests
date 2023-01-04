import {
  Component,
  createEffect,
  createSignal,
  Show,
  Suspense,
  ErrorBoundary,
} from "solid-js";
import styles from "./App.module.css";

import {
  createQuery,
  defaultContext,
  QueryFunction,
} from "../../query/packages/solid-query/src";

import { SolidQueryDevtools } from "./devtools/SolidQueryDevtools";

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
      <SolidQueryDevtools />
      <p>Post ID: {posts()}</p>

      <button onClick={() => setPosts(posts() + 1)}>Increment</button>
      <button onClick={() => setPosts(posts() - 1)}>Decrement</button>
      <h1>Posts</h1>
      <ErrorBoundary
        fallback={(_err, resetSolid) => (
          <div>
            <div>error boundary</div>
            <button
              onClick={() => {
                succeed = true;
                resetSolid();
              }}
            >
              retry
            </button>
          </div>
        )}
      >
        <Suspense fallback={"Loading..."}>
          <Wrapper />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

let succeed = false;
const Wrapper: Component = () => {
  const state = createQuery(() => ({
    queryKey: ["wrapper"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!succeed) {
        throw new Error("Suspense Error Bingo");
      } else {
        return "data";
      }
    },
    retryDelay: 10,
    throwErrors: true,
  }));

  // Suspense only triggers if used in JSX
  return (
    <Show when={state.data}>
      <div>rendered</div>
    </Show>
  );
};
export default App;
