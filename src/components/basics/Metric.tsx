import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

export interface MetricItem {
    name: string;
    value?: any;
}

export default function Metric({ name, value }: MetricItem) {
    return (
        <Grid container direction={"column"}>
            <Typography variant="overline" display="block">{name.toLocaleUpperCase()}</Typography>
            <Typography variant="button" display="block">{value || '-'}</Typography>
        </Grid>
    )
}