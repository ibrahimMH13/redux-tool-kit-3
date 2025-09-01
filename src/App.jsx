import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./app/components/layout";
import { Suspense, lazy } from "react";

const AddPostForm = lazy(() => import("./features/post/addPostForm"));
const PostList = lazy(() => import("./features/post/PostList"));
const ViewPost = lazy(() => import("./features/post/ViewPost"));
const UserList = lazy(() => import("./features/user/UserList"));

function App() {
  return (
    <Suspense fallback={<div>Loading...!!!</div>}>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList />} />
        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<ViewPost />} />
        </Route>
        <Route path="user">
          <Route index element={UserList} />
        </Route>
        {/* CATCH ALL INVALIDE PAGE ROUTE */}
        <Route path="*" element={<Navigate  to='/' replace />} />
      </Route>
    </Routes>
    </Suspense>
    
  );
}

export default App;
