import { createHmac } from "crypto";
import { stringify } from "querystring";

// NOTE: THIS SHOULD NEVER LIVE ON THE CLIENT SIDE AS STATIC DATA!!!!! EITHER USE NODEJS BACKEND (IDEAL) OR GET FROM ANOTHER WAY ON LOAD
const BINANCE_CONFIG = {
    API_KEY: "",
    API_SECRET: "",
}

export const BINANCE_BASE_URL = "https://testnet.binance.vision";
export const BINANCE_WEBSOCKET_BASE_URL = "wss://testnet.binance.vision/ws";

// Can be enhanced to have Rest method as well (POST, GET, etc.)
export const RESOURCE_REST_ENDPOINTS = {
    SEND_ORDER: "/api/v3/order",
    ACCOUNT_INFO: "/api/v3/account", // e.g. balances
    EXCHANGE_INFO: "/api/v3/exchangeInfo",
    TICKER_INFO: "/api/v3/ticker/price",
    ORDER_BOOK: "/api/v3/depth"
}

const buildSign = (queryString: any) => {
    return createHmac('sha256', BINANCE_CONFIG.API_SECRET)
        .update(queryString)
        .digest('hex');
}

// TODO Better Typing
export function signedRequest(data = {} as any, method: string, url: string) {
    const dataWithTimestamp = {
        ...data,
        timestamp: Date.now()
    }
    const queryString = new URLSearchParams(stringify(dataWithTimestamp)).toString()
    let signature = buildSign(queryString);

    const requestConfig: any = {
        method: method,
        mode: "no-cors" as RequestMode,
        baseUrl: BINANCE_BASE_URL,
        proxy: false,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-MBX-APIKEY': BINANCE_CONFIG.API_KEY,
            Authorization: `X-MBX-APIKEY: ${BINANCE_CONFIG.API_KEY}`,
        },
    }

    if (method === 'POST') {
        requestConfig.body = stringify(dataWithTimestamp);
        const fullUrl = `${BINANCE_BASE_URL}${url}?signature=${signature}`;
        return fetch(fullUrl, requestConfig)
    } else if (method === 'GET') {
        const fullUrl = `${BINANCE_BASE_URL}${url}?${queryString}&signature=${signature}`;
        return fetch(fullUrl, requestConfig)
    }
}
