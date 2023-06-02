export interface PortfolioAssets {
    asset: string,
    quantity: number,
}

export interface Balance {
    asset: string,
    quantity: number,
    totalInUSDT?: number
}