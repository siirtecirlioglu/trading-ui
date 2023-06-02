import { Side } from "@/models/order";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

export default function SidePicker( {side, onChange}: {side: Side, onChange: (event: React.MouseEvent<HTMLElement>, newSide: string | null) => void} ) {  
    return (
        <ToggleButtonGroup
            value={side}
            exclusive
            onChange={onChange}
            aria-label="order side">
            <ToggleButton value={Side.BUY} aria-label="buy">
                <Typography>Buy</Typography>
            </ToggleButton>
            <ToggleButton value={Side.SELL} aria-label="sell">
                <Typography>Sell</Typography>
            </ToggleButton>
        </ToggleButtonGroup>
    )
}