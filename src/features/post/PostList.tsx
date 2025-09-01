import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllPosts, getPostsError, getPostsStatus, fetchPosts, getPostsHasMore, getPostsLimit, getPostsPage } from "./PostSlice";
import PostsExcerpt from "./PostsExcerpt";
import { AppDispatch } from "../../app/store";




const PostList = () => {
  // instand of ask from state.post
  // const posts = useSelector(state=> state.posts);
  const posts = useSelector(selectAllPosts);
  const status = useSelector(getPostsStatus);
  const hasMore = useSelector(getPostsHasMore);
  const limit = useSelector(getPostsLimit);
  const error = useSelector(getPostsError);
  const dispatch = useDispatch<AppDispatch>();
  let current = useSelector(getPostsPage);

  useEffect(()=>{
    if(status === 'idle'){
      dispatch(fetchPosts({page: 1, limit: 3}));
    }
  },[dispatch,status]);

  useEffect(()=>{
    const scrollHandler = ()=>{
      console.log('Scroll triggered', {status, hasMore, current});
      if(window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000){
      console.log('Scroll triggered', {status, hasMore, current});
      if(status !== 'loading' && hasMore){
        dispatch(fetchPosts({page: current + 1}));
      }
     }
    };
    window.addEventListener('scroll',scrollHandler, {passive: true });
    return()=>{
      window.removeEventListener('scroll',scrollHandler);
    }
  },[
    dispatch,
    status,
    current,
    hasMore
  ]);
  
  // const orderedPostsList = posts.slice().sort((a,b)=> b.date.localeCompare(a.date));
  
  // const renderedPosts = orderedPostsList.map((post) => (
  //   <PostsExcerpt key={post.id} post={post} />
  // ));
  let render: any;

  if (status ==='loading'){
        render = <p>"Loading ..."</p>
  }else if(status === 'succeeded'){
      const orderedPosts = posts.slice().sort((a,b)=> b.date.localeCompare(a.date));
      render = orderedPosts.map(post=> <PostsExcerpt key={post.id} post={post} />)
    }else if(status === 'failed'){
      render = <p>{error}</p>
  }

  return (
    <div>
      <h2 className="text-green-800 text-7xl font-bold">Posts list</h2>
      <div>{render}</div>
    </div>
  );
};

export default PostList;
