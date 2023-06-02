#!/usr/bin/node
const { Spot, WebsocketStream } = require('@binance/connector')
const { Console } = require('console')

// https://github.com/binance/binance-connector-node/tree/master
// https://testnet.binance.vision/
const BINANCE_CONFIG = {
    API_KEY: "Omzj3JDxvXQyvVOFjzQfcrC7bBwoZJGLP5g3NP2dIj0fNrIVcyw68B2FC4PDHbWx",
    API_SECRET: "O3mzlaLQjc93GgCKuYeukx5ZOY3RXMpAfqc8tG2GQI7eIXQC88fQVQjUjkCpdGnS",
    HOST_URL: "https://testnet.binance.vision",
    WEBSOCKET_HOST_URL: "wss://testnet.binance.vision"
}
const client = new Spot(BINANCE_CONFIG.API_KEY, BINANCE_CONFIG.API_SECRET, { baseURL: BINANCE_CONFIG.HOST_URL } );

// ACCOUNT INFO REST CALL
async function getAccountInfo() {
    const accountInfoResponse = await client.account();
    client.logger.log(accountInfoResponse.data)
    return accountInfoResponse.data;
}

// WEBSOCKET EXAMPLE
const logger = new Console({ stdout: process.stdout, stderr: process.stderr })

const callbacks = {
  open: () => logger.debug('Connected with Websocket server'),
  close: () => logger.debug('Disconnected with Websocket server'),
  message: data => logger.info(data)
}

const websocketStreamClient = new WebsocketStream({ logger, callbacks, wsURL: BINANCE_CONFIG.WEBSOCKET_HOST_URL })

setTimeout(() => websocketStreamClient.disconnect(), 6000)

async function getListenKey() {
    const response = await client.createListenKey(); // First we need to generate a listen key
    return response.data.listenKey;
}

async function subscribeToUserData() {
    const listenKey = await getListenKey();
    websocketStreamClient.userData(listenKey);
}

getAccountInfo();
// subscribeToUserData();
