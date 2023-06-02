import styles from "./Watchlist.module.css";
import Paper from "@mui/material/Paper";
import WatchlistItem from "./WatchlistItem";
import Typography from '@mui/material/Typography';
import { removeInstrumentFromWatchlist, selectWatchlist } from "@/store/watchlistSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useCallback } from "react";
import { unsubscribeInstrument } from "@/store/instrumentsSlice";

export default function Watchlist() {
    const watchlist = useAppSelector(selectWatchlist);
    const dispatch = useAppDispatch();

    // It is not exactly toggling as we can only remove from watchlist
    const handleToggleWatchlist = useCallback((instrumentName: string, newValue: boolean) => {
        dispatch(removeInstrumentFromWatchlist(instrumentName));
        dispatch(unsubscribeInstrument({ subscriptionOwner: 'watchlist', instruments: [instrumentName] }));
    }, []);

    // TODO Convert this to a nested layout
    return (
        <Paper className={`${styles.root}`} elevation={3}>
            <Typography variant="h6" color="palette.primary">WATCHLIST</Typography>
            <div className={`${styles.content}`}>
                {watchlist.length ? (
                    <table className={`${styles.table}`}>
                        <thead>
                            <tr className={`${styles.row}`}>
                                <th className={`${styles.instrumentCell}`}>
                                    <Typography variant="overline">Instrument</Typography>
                                </th>
                                <th className={`${styles.priceCell}`}>
                                    <Typography variant="overline">Price</Typography>
                                </th>
                                <th className={`${styles.favoriteCell}`}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {watchlist.map(watchlistItem => (
                                <WatchlistItem key={watchlistItem} item={watchlistItem} onWatchlistToggle={handleToggleWatchlist} />
                            ))}
                        </tbody>
                    </table>
                ) : 'No Favorite Instruments!'}
            </div>
        </Paper>
    );
}