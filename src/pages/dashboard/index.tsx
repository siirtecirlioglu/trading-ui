import styles from "./Dashboard.module.css";
import OrderBook from "@/components/orderBook/OrderBook";
import OrderForm from "@/components/orderForm/OrderForm";
import Portfolio from "@/components/portfolio/Portfolio";
import Summary from "@/components/summary/Summary";
import Watchlist from "@/components/watchlist/Watchlist";
import useBalances from "@/hooks/useBalances";
import useInstrumentPrices from "@/hooks/useInstrumentPrices";
import { Box, Grid, Stack } from "@mui/material";

export default function DashboardPage() {
    useInstrumentPrices();
    useBalances();
    
    return (
        <Box className={`${styles.root}`}>
            <Stack className={`${styles.content}`}>
                <div className={`${styles.summary}`}>
                    <Summary />
                </div>
                <Grid container spacing={1} className={`${styles.widgets}`}>
                    <Grid item xs={3}>
                        <Watchlist />
                    </Grid>
                    <Grid item xs={3}>
                        <OrderBook />
                    </Grid>
                    <Grid item container xs={6} spacing={2} direction="column">
                        <Grid item flexGrow={0}>
                            <OrderForm />
                        </Grid>
                        <Grid item flexGrow={1}>
                            <Portfolio />
                        </Grid>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}