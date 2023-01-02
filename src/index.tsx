/* @refresh reload */
import { render } from "solid-js/web";
import {
  QueryClientProvider,
  QueryClient,
} from "../../query/packages/solid-query/src";
import "./index.css";
import App from "./App";

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ),
  document.getElementById("root") as HTMLElement
);
