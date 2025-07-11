import { ThemeProvider as CustomThemeProvider } from "@/context/ThemeContext";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/libs/apollo-client";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <CustomThemeProvider>
      <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        </BrowserRouter>
      </QueryClientProvider>
      </ApolloProvider>
    </CustomThemeProvider>
  </Provider>,
  // </React.StrictMode>
);
