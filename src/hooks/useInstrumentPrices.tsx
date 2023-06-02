import { Instrument } from "@/models/instrument";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { InstrumentSubscriptions, selectAllInstrumentSubscriptions, updateAllInstruments } from "@/store/instrumentsSlice";
import { BINANCE_BASE_URL, BINANCE_WEBSOCKET_BASE_URL, RESOURCE_REST_ENDPOINTS } from "@/utils/requests";
import { useState, useRef, useEffect } from "react";

interface BinanceInstrumentTicker {
    e: string; // event type
    E: number; // event time
    s: string; // symbol
    c: string; // close price
    o: string; // open price
    h: string; // high price
    l: string; // low price
    v: string; // total traded base asset volume
    q: string; // total traded quote asset volume
}

interface BinanceInstrumentTickerSimple {
    symbol: string; // symbol
    price: string; // close price
}

interface BinanceSubscriptionResult {
    result: null;
    id: number;
}

/* 
    1. On initial load, create the WebSocket (this is a ref as its not needed for rendering and we dont worry about its value being mutated)
    2. On initial load, fetch price data for all tickers from Binance. We need this so that user doesn't see 0s before price updates start coming
    3. Update prices whenever websocket sends a message
    4. Maintain the subscription list
*/

// TODO Handle websocket errors, intentionally closing and unintentionally closing (e.g. disconnect) better
export default function useInstrumentPrices() {
    const instruments = useAppSelector((state) => state.instruments.allInstruments);
    const subscriptions = useAppSelector(selectAllInstrumentSubscriptions);
    const [previousSubscriptions, setPreviousSubscriptions] = useState<string[]>([]);
    const [previousSubscriptionId, setPreviousSubscriptionId] = useState<number | undefined>();
    const [isWsOpen, setIsWsOpen] = useState(false);
    const dispatch = useAppDispatch();

    const webSocketRef = useRef<WebSocket | null>(null);

    // 1. Create the websocket and manage it here
    useEffect(() => {
        webSocketRef.current = new WebSocket(BINANCE_WEBSOCKET_BASE_URL);

        webSocketRef.current.onopen = (event) => {
            console.log("Opened!");
            setIsWsOpen(true);
        }

        webSocketRef.current.onerror = (event) => {
            console.log("Error: " + event);
        };

        webSocketRef.current.onclose = () => {
            console.log("Closing!");
            setIsWsOpen(false);
        };

        const webSocketCurrent = webSocketRef.current;

        return () => {
            webSocketCurrent.close();
        }
    }, []);

    // 2. Get initial prices
    // Potential race condition with websocket updates but opening websocket is likely to take longer than fetching initial data
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`${BINANCE_BASE_URL}${RESOURCE_REST_ENDPOINTS.TICKER_INFO}`);
            if (response.ok) {
                const data: BinanceInstrumentTickerSimple[] = await response.json(); // TODO Create TS Interface for this
                if (data.length) {
                    const newInstruments = [...instruments];
                    data.forEach(({symbol, price}) => updateWithNewInstrument(newInstruments, symbol, Number(price)));
                    dispatch(updateAllInstruments(newInstruments));
                }
            } else {
                console.log('Couldnt fetch the instruments! Refresh page'); // TODO Retry mechanism
            }
        }

        fetchData();
    }, []);

    // 3. Process price updates
    useEffect(() => {
        if (!webSocketRef.current) {
            return;
        }

        webSocketRef.current.onmessage = (event) => {
            const response: BinanceInstrumentTicker | BinanceSubscriptionResult = JSON.parse(event.data);
            if (!response.hasOwnProperty('result')) {
                const ticker = response as BinanceInstrumentTicker;
                const newInstruments = [...instruments];
                updateWithNewInstrument(newInstruments, ticker.s, Number(ticker.c));
                dispatch(updateAllInstruments(newInstruments));
            }
        };

    }, [instruments]);

    // 4. Correctly subscribe to instruments
    useEffect(() => {
        // TODO Improve so that if the results are the same, don't unsubscribe and resubscribe
        if (previousSubscriptions.length && webSocketRef.current?.readyState === WebSocket.OPEN) {
            webSocketRef.current.send(
                JSON.stringify({
                    method: "UNSUBSCRIBE",
                    params: previousSubscriptions,
                    id: previousSubscriptionId,
                })
            )
        }

        const instrumentsToRequest = getInstrumentsToRequest(subscriptions);
        if (instrumentsToRequest.length && webSocketRef.current?.readyState === WebSocket.OPEN) {
            const subscriptionId = new Date().getTime();
            webSocketRef.current.send(
                JSON.stringify({
                    method: "SUBSCRIBE",
                    params: [...Array.from(new Set(instrumentsToRequest))], // remove duplicates
                    id: new Date().getTime(),
                })
            )
            setPreviousSubscriptions(instrumentsToRequest);
            setPreviousSubscriptionId(subscriptionId);
        }
    }, [isWsOpen, subscriptions]);

}

// HELPER LOGIC - Can move to utils
function getInstrumentsToRequest(subscriptions: InstrumentSubscriptions) {
    return Object.values(subscriptions)
        .flatMap((instruments: string[]) => instruments)
        .map((instrument) => `${instrument.toLocaleLowerCase()}@miniTicker`);
}

function updateWithNewInstrument(newInstruments: Instrument[], asset: string, price: number) {
    const index = newInstruments.findIndex((instrument) => instrument.name === asset);
    if (index >= 0) {
        newInstruments[index] = {
            ...newInstruments[index],
            price: price
        }
    } else {
        newInstruments.push({
            name: asset,
            price: price
        });
    }
    return newInstruments
}
