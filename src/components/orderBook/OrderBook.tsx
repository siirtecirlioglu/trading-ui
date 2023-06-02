import styles from "./OrderBook.module.css";
import { Stack } from '@mui/material';
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';
import OrderBookTable from './OrderBookTable';
import useOrderBook from "@/hooks/useOrderBook";

export default function OrderBook() {
    const [asks, bids] = useOrderBook();

    // TODO Convert this to a nested layout
    return (
        <Paper className={`${styles.root}`} elevation={3}>
            <Typography variant="h6">ORDER BOOK</Typography>
            <div className={`${styles.content}`}>
                <Stack spacing={2}>
                    <OrderBookTable data={asks}/>
                    <OrderBookTable data={bids} hideHeader/>
                </Stack>
            </div>
        </Paper>
    );
}