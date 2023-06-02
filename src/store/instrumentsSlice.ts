import { Instrument } from "@/models/instrument";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

// STATE
export interface InstrumentsState {
    selectedInstrument?: string;
    allInstruments: Instrument[];
    instrumentSubscriptions: InstrumentSubscriptions;
}

export interface InstrumentSubscriptions {
        watchlist: string[];
        balances: string[];
        selected: string[]; // Note that this will be max 1 item but for ease of logic we are keeping as set
}

const initialState: InstrumentsState = {
    selectedInstrument: 'BTCUSDT', // This is not an ideal way of handling this but BTCUSDT is likely the most available and searched instrument
    allInstruments: [],
    instrumentSubscriptions: {
        watchlist: [],
        balances: [],
        selected: []
    }
}

// ACTIONS
export type SubscriptionOwner = keyof InstrumentSubscriptions; 

export interface InstrumentSubscriptionAction {
    subscriptionOwner: SubscriptionOwner;
    instruments: string[]
}

// SLICE
export const instrumentsSlice = createSlice({
    name: 'instruments',
    initialState: initialState,
    reducers: {
        selectInstrument: (state, action) => {
            state.selectedInstrument = action.payload
        },
        updateAllInstruments: (state, action) => {
            state.allInstruments = action.payload
        },
        subscribeInstrument: (state, action: PayloadAction<InstrumentSubscriptionAction>) => {
            state.instrumentSubscriptions[action.payload.subscriptionOwner] = action.payload.instruments;
        },
        unsubscribeInstrument: (state, action: PayloadAction<InstrumentSubscriptionAction>) => {
            state.instrumentSubscriptions[action.payload.subscriptionOwner] = state.instrumentSubscriptions[action.payload.subscriptionOwner]
                .filter((instrument) => !action.payload.instruments.includes(instrument));
        },
    }
});

// SELECTORS
export const selectSelectedInstrument = (state: RootState) => state.instruments.selectedInstrument;
export const selectAllInstruments = (state: RootState) => state.instruments.allInstruments;
export const selectAllInstrumentSubscriptions = (state: RootState) => state.instruments.instrumentSubscriptions;

export const { selectInstrument, updateAllInstruments, subscribeInstrument, unsubscribeInstrument } = instrumentsSlice.actions;

export default instrumentsSlice.reducer;