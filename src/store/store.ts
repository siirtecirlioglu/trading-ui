import { configureStore } from "@reduxjs/toolkit";
import instrumentsReducer from "./instrumentsSlice";
import watchlistReducer from "./watchlistSlice";

const store = configureStore({
    reducer: {
        instruments: instrumentsReducer,
        watchlist: watchlistReducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;