import styles from "./OrderForm.module.css";
import { Order, OrderType, Side } from "@/models/order";
import { Button, Grid, SelectChangeEvent, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useState } from "react";
import SideSelector from "./basics/SideSelector";
import OrderTypeSelector from "./basics/OrderTypeSelector";
import { useAppSelector } from "@/store/hooks";
import { selectAllInstruments, selectSelectedInstrument } from "@/store/instrumentsSlice";
import { RESOURCE_REST_ENDPOINTS, signedRequest } from "@/utils/requests";

const defaultOrder: Order = {
    side: Side.BUY,
    orderType: OrderType.LIMIT,
    price: 0,
    quantity: 1,
    total: 0
}

// TODO A lot of smaller reusable components - we can make each input of form a component for cleanliness and easier state management
// TODO Order status should be checked and isDisabled should be updated
export default function SpotOrderForm() {
    const instruments = useAppSelector(selectAllInstruments);
    const selectedInstrument = useAppSelector(selectSelectedInstrument);
    const [order, setOrder] = useState({...defaultOrder});
    const [userEdited, setUserEdited] = useState(false);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const selectedInstrumentPrice = instruments.find(instrument => instrument.name === selectedInstrument)?.price;

        // Note: this logic can get complex quickly so keep an eye
        const newPrice = userEdited && order.orderType === OrderType.LIMIT ? order.price : selectedInstrumentPrice || defaultOrder.price;
        const total = newPrice * order.quantity;

        setOrder({
            ...order,
            price: newPrice,
            total: total,
            instrument: selectedInstrument
        })
    }, [selectedInstrument, instruments]);

    useEffect(() => {
        setUserEdited(false);
    }, [selectedInstrument]);

    const handleUpdateSide = useCallback((event: React.MouseEvent<HTMLElement>, newSide: string | null) => {
        setOrder({
            ...order,
            side: newSide ? Side[newSide as keyof typeof Side] : defaultOrder.side
        })
        setUserEdited(true);
    }, [order]);

    const handleUpdateOrderType = useCallback((event: SelectChangeEvent) => {
        const newOrderType = event.target.value as string;
        setOrder({
            ...order,
            orderType: newOrderType ? OrderType[newOrderType as keyof typeof OrderType] : defaultOrder.orderType
        })
        setUserEdited(true);
    }, [order]);

    const handleUpdateQuantity = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = Number(event.target.value) || defaultOrder.quantity;
        setOrder({
            ...order,
            quantity: newQuantity,
            total: order.price * newQuantity
        })
        setUserEdited(true);
    }, [order]);

    const handleUpdatePrice = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = Number(event.target.value) || defaultOrder.price;
        setOrder({
            ...order,
            price: newPrice,
            total: order.quantity * newPrice
        })
        setUserEdited(true);
    }, [order]);

    const handleUpdateTotal = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newTotal = Number(event.target.value) || defaultOrder.total;
        setOrder({
            ...order,
            total: newTotal,
            quantity: newTotal / order.price
        })
        setUserEdited(true);
    }, [order]);

    const handleSubmit = useCallback(() => {
        async function postOrder() {
            const data = {
                symbol: order.instrument,
                side: order.side,
                type: order.orderType,
                quantity: order.quantity,
                price: order.price,
                timeInForce: "GTC",
                timestamp: Date.now()
            };
            const resp = await signedRequest(data, "POST", RESOURCE_REST_ENDPOINTS.SEND_ORDER);
            if (resp.ok) {
                const data = await resp.json(); // TODO Create TS Interface for this
                console.log(data);
            } else {
                console.log('Couldnt fetch the submit order! Refresh page'); // TODO Retry mechanism or better alerting
            }
        }

        postOrder();
        setDisabled(true);
    }, [order]);

    return (
        <Box>
            <Grid container spacing={2} className={`${styles.spotOrderForm}`}>
                <Grid item xs={4}>
                    <SideSelector side={order.side} onChange={handleUpdateSide} />
                </Grid>
                <Grid item xs={4}>
                    <OrderTypeSelector orderType={order.orderType} onChange={handleUpdateOrderType} />
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <TextField
                        id="quantity"
                        label="Quantity"
                        variant="outlined"
                        type="number"
                        value={order.quantity}
                        onChange={handleUpdateQuantity} />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id="price"
                        label="Price"
                        variant="outlined"
                        type="number"
                        value={order.price}
                        onChange={handleUpdatePrice}
                        disabled={OrderType.MARKET === order.orderType} />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id="total"
                        label="Total"
                        variant="outlined"
                        type="number"
                        value={order.total}
                        onChange={handleUpdateTotal} />
                </Grid>
                <Grid item xs={12}>
                    <Button className={`${styles.submitButton}`} variant="contained" onClick={handleSubmit} disabled={!order.instrument || disabled}>
                        {`${Side[order.side]} ${order.instrument}`}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}