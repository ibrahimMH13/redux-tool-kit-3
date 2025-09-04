import {
  createAsyncThunk,
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";
import { ApiSlice } from "../api/ApiSlice";
import { build } from "vite";


const postsAdapter = createEntityAdapter<Post>({
sortComparer:(a,b) => b.date.localeCompare(a.date),
});
const initialState = postsAdapter.getInitialState();

type reaction = {
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
};

type Post = {
  id: string | number;
  title: string;
  content: string;
  userId?: string;
  date: string;
  reactions: reaction;
};

export const extendedApiSlice = ApiSlice.injectEndpoints({
  endpoints:builder=>({
      getPosts: builder.query({
        query:()=>'/posts',
        transformResponse: response =>{
          let min =1;
          const loadedPosts = response.map(post=>{
            if(!post.date) post.date = sub(new Date(),{minutes:min +5}).toISOString();
            if(!post.reactions) post.reactions = {
              wow:0,
              heart:0,
              rocket:0,
              coffee:0,
            }
            return post;
          });
          return postsAdapter.setAll(initialState,loadedPosts);
        },
        providesTags:(result,err,arg)=>[
          {type:'posts' as const,id:'LIST'},
          ...(result?.ids?.map(id => ({type:'posts' as const,id})) || [])
        ]
      }),
      getPostsByUserId:builder.query({
        query: id => `/posts?userId=${id}`,
        transformResponse: data =>{
          let min = 1;
          const loadedPosts = data.map(post=>{
            if(!post.date) post.date = sub(new Date(),{minutes:min +5}).toISOString();
            if(!post.reactions) post.reactions = {
                wow:0,
                heart:0,
                rocket:0,
                coffee:0,
            }
            return post;
          });
          return postsAdapter.setAll(initialState,loadedPosts);
        },
        providesTags:(r,e,a)=>{
          return [
            ...(r?.ids?.map(id=>({type:'posts' as const,id})) || [])
          ]
        }
      }),
      addNewPost: builder.mutation({
        query: initialPost =>({
          url:'/posts',
          method:'POST',
          body:{
            ...initialPost,
            userId: Number(initialPost.userId),
            date: new Date().toISOString(),
            reactions:{
              wow:0,
              heart:0,
              rocket:0,
              coffee: 0
            }
          }
        }),
        invalidatesTags:[
          {
            type: 'posts',id:"LIST"
          }
        ]
      }),
      updatePost: builder.mutation({
        query: initialPost =>({
          url: `/posts/${initialPost.id}`,
          method:'PUT',
          body:{
            ...initialPost,
            date:new Date().toISOString()
          }
        }),
        invalidatesTags:(r,e,a)=>[
          {
            type:'posts',id:a.id
          }
        ]
      }),
      deletePost:builder.mutation({
        query: ({id})=>({
          url:`/posts/${id}`,
          method:'DELETE',
          body:{id}
        })
      })
  })  
});

// Export the generated hook
export const { 
  useLazyGetPostsQuery ,
  useLazyGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation
} = extendedApiSlice;

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select(undefined);
const selectedPostsData = createSelector(
  selectPostsResult ,
  postsResult => postsResult.data 
);

export const {
  selectAll:selectAllPosts,
  selectById: selectPostById,
  selectIds : selectPostIds
 } = postsAdapter.getSelectors((state: any) => selectedPostsData(state) ?? initialState);