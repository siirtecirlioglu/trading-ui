import { OrderBookEntry } from "@/models/orderbook";
import { useAppSelector } from "@/store/hooks";
import { selectSelectedInstrument } from "@/store/instrumentsSlice";
import { BINANCE_BASE_URL, RESOURCE_REST_ENDPOINTS } from "@/utils/requests";
import { useEffect, useState } from "react";

interface BinanceOrderBook {
    lastUpdateId: string;
    bids: string[][]; // depth -> [price, qty]
    asks: string[][];
}

export default function useOrderBook() {
    const selectedInstrument = useAppSelector(selectSelectedInstrument);
    const [asks, setAsks] = useState<OrderBookEntry[]>([]);
    const [bids, setBids] = useState<OrderBookEntry[]>([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`${BINANCE_BASE_URL}${RESOURCE_REST_ENDPOINTS.ORDER_BOOK}?symbol=${selectedInstrument}&limit=10`);
            if (response.ok) {
                const data: BinanceOrderBook = await response.json(); // TODO Create TS Interface for this
                if (data) {
                    const newAsks: OrderBookEntry[] = data.asks.map((ask) => ({ price: Number(ask[0]), quantity: Number(ask[1])}));
                    const newBids: OrderBookEntry[] = data.bids.map((bid) => ({ price: Number(bid[0]), quantity: Number(bid[1])}));
                    setAsks(newAsks.reverse());
                    setBids(newBids);
                }
            } else {
                console.log('Couldnt fetch the instruments! Refresh page'); // TODO Retry mechanism
            }
        }

        let pollId: any; // TODO Use correct type
        if (selectedInstrument) {
            pollId = setInterval(fetchData, 1000);
        }
        
        return () => {
            if (pollId) {
                clearInterval(pollId);
            }
        }
    }, [selectedInstrument]);

    return [asks, bids]
}