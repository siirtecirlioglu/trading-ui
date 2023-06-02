import { OrderType } from "@/models/order";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

export default function OrderTypeSelector({ orderType, onChange }: { orderType: OrderType, onChange: (event: SelectChangeEvent) => void }) {
    return (
        <FormControl fullWidth>
            <InputLabel id="order-type-label">Order Type</InputLabel>
            <Select
                labelId="order-type-label"
                id="order-type"
                value={orderType}
                label="Order Type"
                onChange={onChange}>
                <MenuItem value={OrderType.LIMIT}>{OrderType[OrderType.LIMIT]}</MenuItem>
                <MenuItem value={OrderType.MARKET}>{OrderType[OrderType.MARKET]}</MenuItem>
            </Select>
        </FormControl>
    )
}