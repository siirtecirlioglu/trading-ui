import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

// STATE
export interface WatchlistState {
    current: string[];
}

const initialState: WatchlistState = {
    current: [],
}

// SLICE
export const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState: initialState,
    reducers: {
        addInstrumentToWatchlist: (state, action: PayloadAction<string>) => {
            state.current = [
                ...state.current,
                action.payload
            ]
        },
        removeInstrumentFromWatchlist: (state, action: PayloadAction<string>) => {
            const index = state.current.indexOf(action.payload);
            state.current.splice(index, 1);
        },
    }
});

// SELECTORS
export const selectWatchlist = (state: RootState) => state.watchlist.current;

export const { addInstrumentToWatchlist, removeInstrumentFromWatchlist } = watchlistSlice.actions;

export default watchlistSlice.reducer;