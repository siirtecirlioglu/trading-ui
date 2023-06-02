import { BINANCE_BASE_URL, RESOURCE_REST_ENDPOINTS } from "@/utils/requests";
import { useState, useEffect } from "react";

export default function useExchangeInstruments() {
    const [exchangeInstruments, setExchangeInstruments] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`${BINANCE_BASE_URL}${RESOURCE_REST_ENDPOINTS.EXCHANGE_INFO}`);
            if (response.ok) {
                const data = await response.json(); // TODO Create TS Interface for this
                const allInstruments = data.symbols.map((symbol: {symbol: string}) => symbol.symbol);
                setExchangeInstruments(allInstruments);
            } else {
                console.log('Couldnt fetch the instruments! Refresh page'); // TODO Retry mechanism
            }
        }
        
        fetchData();
        
        return () => setExchangeInstruments([]);
    }, []);

    return exchangeInstruments;
}