import styles from "./Portfolio.module.css";
import Paper from "@mui/material/Paper";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Metric from '../basics/Metric';
import { Balance, PortfolioAssets } from '@/models/portfolio';
import Balances from './Balances';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAllInstruments, subscribeInstrument } from "@/store/instrumentsSlice";
import { STABLECOINS, USDT } from "@/models/constants";

// TODO Remove for real data - This is a snapshot of testnet account by using @binance/connector in nodejs
const defaultPortfolioAssets: PortfolioAssets[] = [
    { asset: 'BNB', quantity: 1000 },
    { asset: 'BTC', quantity: 1 },
    { asset: 'BUSD', quantity: 10000 },
    { asset: 'ETH', quantity: 100 },
    { asset: 'LTC', quantity: 500 },
    { asset: 'TRX', quantity: 500000 },
    { asset: 'USDT', quantity: 10000 },
    { asset: 'XRP', quantity: 50000 }
];

export default function Portfolio() {
    const instruments = useAppSelector(selectAllInstruments);
    const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAssets[]>([]);
    const [balances, setBalances] = useState<Balance[]>([]);
    const dispatch = useAppDispatch();

    // TODO Due to Binance signed api issues real balances cannot be retrieved live
    useEffect(() => {
        const newPortfolioAssets = [...defaultPortfolioAssets];
        setPortfolioAssets(newPortfolioAssets);

        const newInstrumentsForPortfolioAssets = newPortfolioAssets
            .filter(({asset}) => !STABLECOINS.includes(asset))    
            .map(({asset}) => `${asset}${USDT}`);
        dispatch(subscribeInstrument({subscriptionOwner: 'balances', instruments: newInstrumentsForPortfolioAssets}));
    }, []);

    useEffect(() => {
        const newBalances = portfolioAssets.map((balance) => {
            let totalInUSDT: number;
            if (STABLECOINS.includes(balance.asset)) {
                totalInUSDT = balance.quantity;
            } else {
                const usdInstrument = instruments.find(instrument => instrument.name === `${balance.asset}USDT`);
                const priceInUSDT = usdInstrument?.price ?? 0;
                totalInUSDT = balance.quantity * priceInUSDT;
            }
            
            return {
                ...balance,
                totalInUSDT: totalInUSDT
            }
        });

        setBalances(newBalances);
    }, [portfolioAssets, instruments]);

    const totalBalance = balances.reduce((total, balance) => total + (balance.totalInUSDT || 0), 0);

    const numberOfAssets = Object.keys(balances).length;

    // TODO Convert this to a nested layout
    return (
        <Paper className={`${styles.root}`} elevation={5}>
            <Typography variant="h6">PORTFOLIO</Typography>
            <div className={`${styles.content}`}>
                <Stack spacing={2}>
                    <Stack direction="row" className={`${styles.stats}`}>
                        <Metric name='Total USDT' value={totalBalance.toLocaleString()} />
                        <Metric name='Assets' value={numberOfAssets} />
                    </Stack>
                    <div className={`${styles.balances}`}>
                        <Balances balances={balances}/>
                    </div>
                </Stack>
            </div>
        </Paper>
    );
}