import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { fetchUsers } from "./features/user/UserSlice.js";
import { BrowserRouter as Router,Route } from "react-router";
import { extendedApiSlice } from "./features/post/PostSlice.js";

store.dispatch(fetchUsers());
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <Router>
       <App />
      </Router>
    </StrictMode>
  </Provider>
);
