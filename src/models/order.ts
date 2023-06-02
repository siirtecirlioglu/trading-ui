export enum Side {
    BUY = "BUY",
    SELL = "SELL"
}

export enum OrderType {
    LIMIT = "LIMIT",
    MARKET = "MARKET"
}

export interface Order {
    id?: string;
    instrument?: string;
    side: Side;
    orderType: OrderType;
    price: number;
    quantity: number;
    total: number;
}