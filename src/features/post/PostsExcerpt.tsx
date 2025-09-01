import React from "react";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionBtn from "./ReactionBtn";
import { Link } from "react-router-dom";

const PostsExcerpt = ({ post }: { post: any }) => {
  return (
    <article
      className="card border-2 bg-red-400 text-white m-2 p-2"
    >
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <Link to={`post/${post.id}`}>View Post</Link>
      <PostAuthor userId={post.userId ?? null} />
      <TimeAgo timestamp={post.date} />
      <ReactionBtn post={post} />
    </article>
  );
};

export default PostsExcerpt;
