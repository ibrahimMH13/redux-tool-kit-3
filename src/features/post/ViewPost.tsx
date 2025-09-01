import React from "react";
import { useSelector } from "react-redux";
import { getPost } from "./PostSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionBtn from "./ReactionBtn";
import { useParams } from "react-router-dom";

const ViewPost = () => {
  const { postId } = useParams();
  console.log(postId);
  const post = useSelector((state) => getPost(state, Number(postId)));
  return (
    <>
      {post ? (
        <article className="card border-2 bg-red-400 text-white m-2 p-2">
          <h3>{post.title}</h3>
          <p>{post.body.substring(0, 100)}</p>
          <PostAuthor userId={post.userId ?? null} />
          <TimeAgo timestamp={post.date} />
          <ReactionBtn post={post} />
        </article>
      ) : (
        <div>
          <p>Post Not found</p>
        </div>
      )}
    </>
  );
};

export default ViewPost;
