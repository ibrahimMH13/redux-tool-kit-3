import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../features/user/UserSlice";
import { ApiSlice } from "../features/api/ApiSlice";

const store = configureStore({
    reducer:{
        [ApiSlice.reducerPath]: ApiSlice.reducer,
        users:UserReducer
    },
    middleware: getDefaultMid => getDefaultMid().concat(ApiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;