import styles from "./Summary.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useCallback } from "react";
import Metric from '../basics/Metric';
import Favorite from '../basics/Favorite';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAllInstruments, selectInstrument, selectSelectedInstrument, subscribeInstrument, unsubscribeInstrument } from "@/store/instrumentsSlice";
import { addInstrumentToWatchlist, removeInstrumentFromWatchlist, selectWatchlist } from "@/store/watchlistSlice";
import useExchangeInstruments from "@/hooks/useExchangeInstruments";

export default function Summary() {
    const exchangeInstruments = useExchangeInstruments();
    const selectedInstrument = useAppSelector(selectSelectedInstrument);
    const instruments = useAppSelector(selectAllInstruments);
    const watchlist = useAppSelector(selectWatchlist);
    const dispatch = useAppDispatch();

    // TODO Create selectors for these as they are derived from values living in the redux store
    const isFavorite = selectedInstrument ? watchlist.includes(selectedInstrument) : false;
    const selectedInstrumentPrice = instruments.find((instrument) => instrument.name === selectedInstrument)?.price?.toLocaleString();
    
    const handleSelectInstrument = useCallback((instrumentName: string | null) => {
        if (instrumentName) {
            dispatch(subscribeInstrument({subscriptionOwner: 'selected', instruments: [instrumentName]}));
            dispatch(selectInstrument(instrumentName));
        }
    }, [selectedInstrument]);

    const handleToggleWatchlist = useCallback((newValue: boolean) => {
        if (selectedInstrument) {
            if (newValue) {
                dispatch(addInstrumentToWatchlist(selectedInstrument));
                dispatch(subscribeInstrument({subscriptionOwner: 'watchlist', instruments: [...watchlist, selectedInstrument]}));
            } else {
                dispatch(removeInstrumentFromWatchlist(selectedInstrument));
                dispatch(unsubscribeInstrument({subscriptionOwner: 'watchlist', instruments: [selectedInstrument]}));
            }
        }
    }, [selectedInstrument]);


    return (
        <Paper className={`${styles.root}`}>
            <Stack direction={"row"} spacing={2} justifyContent={"start"}>
                {exchangeInstruments.length > 0 && <Autocomplete
                    disablePortal
                    disableClearable
                    id="instrument-select"
                    options={exchangeInstruments}
                    className={`${styles.instrumentSelector}`}
                    value={selectedInstrument}
                    onChange={(event: any, newValue: string | null) => handleSelectInstrument(newValue)}
                    renderInput={(params) => <TextField {...params} label="Instrument" />}
                />}
                { selectedInstrument && <Metric name={"Last Price"} value={selectedInstrumentPrice} /> }
                { selectedInstrument && <Favorite isFavorite={isFavorite} onToggle={handleToggleWatchlist}/> }
            </Stack>
        </Paper>
    );
}