import styles from "./Watchlist.module.css";
import { useCallback } from "react";
import Favorite from '../basics/Favorite';
import { selectAllInstruments } from "@/store/instrumentsSlice";
import { useAppSelector } from "@/store/hooks";

interface WatchlistItemProps {
    item: string;
    onWatchlistToggle: (instrumentName: string, value: boolean) => void;
}

export default function WatchlistItem({ item, onWatchlistToggle }: WatchlistItemProps) {
    const instruments = useAppSelector(selectAllInstruments);

    // TODO Create selector for this
    const currentInstrument = instruments.find(instrument => instrument.name === item);

    const handleOnWatchlistClick = useCallback((newValue: boolean) => {
        onWatchlistToggle(item, newValue);
    }, [item]);

    return (
        <tr className={`${styles.row}`}>
            <td className={`${styles.instrumentCell}`}>{item}</td>
            <td className={`${styles.priceCell}`}>{currentInstrument?.price?.toLocaleString()}</td>
            <td className={`${styles.favoriteCell}`}><Favorite isFavorite onToggle={handleOnWatchlistClick}/></td>
        </tr>
    );
}