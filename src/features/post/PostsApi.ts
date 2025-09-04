import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

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

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState();

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: (response: any[]) => {
        let min = 1;
        const loadedPosts = response.map((post: any) => {
          if (!post.date) post.date = sub(new Date(), { minutes: min + 5 }).toISOString();
          if (!post.reactions) post.reactions = {
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => [
        { type: 'Post', id: 'LIST' },
        ...(result?.ids?.map((id) => ({ type: 'Post' as const, id })) || [])
      ]
    })
  })
});

export const { useGetPostsQuery } = postsApi;

// Create selector for the posts data  
const selectPostsResult = postsApi.endpoints.getPosts.select(undefined);
const selectPostsData = (state: any) => selectPostsResult(state)?.data;

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors((state: any) => selectPostsData(state) ?? initialState);