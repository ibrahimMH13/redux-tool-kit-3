import { configureStore } from "@reduxjs/toolkit";
import PostReducer from "../features/post/PostSlice"
import UserReducer from "../features/user/UserSlice";

const store = configureStore({
    reducer:{
        posts:PostReducer,
        users:UserReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;