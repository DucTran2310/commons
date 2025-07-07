import { ThemeProvider as CustomThemeProvider } from "@/context/ThemeContext";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { StagewiseToolbar } from '@stagewise/toolbar-react';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <CustomThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
          <StagewiseToolbar />
        </BrowserRouter>
      </QueryClientProvider>
    </CustomThemeProvider>
  </Provider>,
  // </React.StrictMode>
);
