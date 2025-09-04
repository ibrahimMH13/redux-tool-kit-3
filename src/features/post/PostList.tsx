import React from "react";
import { useGetPostsQuery } from "./PostSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostList = () => {
  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsQuery(undefined);

  let render: any;

  if (isLoading) {
    render = <p>Loading...</p>;
  } else if (isSuccess && posts) {
    const orderedPosts = Object.values(posts.entities).sort((a: any, b: any) => 
      b.date.localeCompare(a.date)
    );
    render = orderedPosts.map((post: any) => <PostsExcerpt key={post.id} post={post} />);
  } else if (isError) {
    render = <p>Error: {error?.toString()}</p>;
  }

  return (
    <div>
      <h2 className="text-green-800 text-7xl font-bold">Posts list</h2>
      <div>{render}</div>
    </div>
  );
};

export default PostList;
