import IconButton from "@mui/material/IconButton";
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useCallback } from "react";

export default function Favorite({ isFavorite, onToggle }: { isFavorite: boolean | undefined; onToggle: (value: boolean) => void } ) {
    const handleOnClick = useCallback(() => {
        onToggle(!isFavorite);
    }, [isFavorite, onToggle]);
    
    return (
        <IconButton aria-label="watchlist" onClick={handleOnClick}>
            {isFavorite ? <StarIcon /> : <StarOutlineIcon />}
        </IconButton>
    );
}