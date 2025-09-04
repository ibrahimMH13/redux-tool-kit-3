import {
  createAsyncThunk,
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";
import { ApiSlice } from "../api/ApiSlice";
import { build } from "vite";

// const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

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

// const initialState: Post[] = [
//   {
//     id: 1,
//     title: "learning Redux Toolkit",
//     content: "I've heard good things",
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions:{
//       wow:0,
//       heart:0,
//       rocket:0,
//       coffee:0
//     }
//   },
//   {
//     id: 2,
//     title: "learning Redux Toolkit",
//     content: "I've heard good things",
//     date: sub(new Date(), { minutes: 50 }).toISOString(),
//     reactions:{
//       wow:0,
//       heart:0,
//       rocket:0,
//       coffee:0
//     }
//   },
// ];

// const initialState = postsAdapter.getInitialState({
//   status: "idle",
//   error: null,
//   totalPage: 0,
//   current: 1,
//   limit: 3,
//   count: 0,
//   hasMore: false
// });

// export const fetchPosts = createAsyncThunk("posts/fetch", async ({page=1,limit=3}:{page?:number,limit?:number} = {}) => {
//   const API = `${POSTS_URL}?_page=${page}&_limit=${limit}`;
//   console.log(API);
//   const response = await axios.get(API);
//   console.log(response.data);
//   return [...response.data];
// });
// export const addNewPost = createAsyncThunk("posts/add", async (initialPost: {title: string, body: string, userId: string}) => {

//   const response = await axios.post(POSTS_URL,initialPost);
//   return response.data;
// });

// const postSlice = createSlice({
//   name: "posts",
//   initialState,
//   reducers: {
//     addPost: {
//       reducer: (state, action: PayloadAction<Post>) => {
//         postsAdapter.addOne(state, action.payload);
//       },
//       prepare: (title: string, content: string, userId: string) => {
//         return {
//           payload: {
//             id: nanoid(),
//             title,
//             content,
//             userId,
//             date: new Date().toISOString(),
//             reactions: {
//               wow: 0,
//               heart: 0,
//               rocket: 0,
//               coffee: 0,
//             },
//           },
//         };
//       },
//     },
//     addReaction(
//       state,
//       action: PayloadAction<{ postId: string | number; reaction: string }>
//     ) {
//       const { postId, reaction } = action.payload;
//       const post = state.entities[postId];
//       if (post && post.reactions) {
//         post.reactions[reaction as keyof reaction]++;
//       }
//     },
//     incerateCount(state, action){
//       state.count = (state.count || 0) + 1;
//     },
//   },
//   extraReducers(builder) {
//     builder.addCase(fetchPosts.pending, (state, action) => {
//       state.status = "loading";
//     }),
//       builder.addCase(fetchPosts.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         let min = 1;
//         const loadingPosts = action.payload.map((post) => {
//           post.date = sub(new Date(), { minutes: min++ }).toISOString();
//           post.reactions = {
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0,
//           };
//           return post;
//         });
//         postsAdapter.addMany(state, loadingPosts);
//         state.hasMore = action.payload.length === action.meta.arg.limit;
//         state.current = action.meta.arg.page || 1;
//         console.log('hasMore calculation:', action.payload.length, action.meta.arg.limit);
//       }).addCase(fetchPosts.rejected,(state,action)=>{
//         state.status = 'failed';
//         state.error = action.error.message || null;

//       }).addCase(addNewPost.fulfilled,(state,action)=>{
//         action.payload.userId = Number(action.payload.userId);
//         action.payload.date = new Date().toISOString();
//         action.payload.reactions = {
//           wow: 0,
//           heart: 0,
//           rocket: 0,
//           coffee: 0,
//         }
//         console.log('new post ',action.payload);
//         postsAdapter.addOne(state, action.payload);
//       });
//   },
// });


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
      })
  })  
});

// Export the generated hook
export const { useGetPostsQuery } = extendedApiSlice;
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

// export const getPostsStatus = (state: any) => state.posts.status;
// export const getPostsHasMore = (state: any) => state.posts.hasMore;
// export const getPostsPage = (state: any) => state.posts.current;
// export const getPostsLimit = (state: any) => state.posts.limit;
// export const getPostsError = (state: any) => state.posts.error;
// export const getCount = (state: any) => state.posts.count;
// export const getPost = (state: any, postId: number) => {
//     return selectPostById(state, postId);
// };
// export const selectPostsByUser = createSelector(
//   [selectAllPosts,(state,userId)=>userId],
//   (posts,userId)=> posts.filter(post=>post.userId ===userId)
// );
// export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select(undefined);

// const selectPostsData = createSelector(
//   selectPostsResult,
//   postResult => postResult.data
// )
// export const { addPost, addReaction ,incerateCount} = postSlice.actions;
// export default postSlice.reducer;

// export const {
//   selectAll,
//   selectById,
//   selectIds
// } = postsAdapter.getSelectors((state: any) => selectPostsData(state) ?? initialState);