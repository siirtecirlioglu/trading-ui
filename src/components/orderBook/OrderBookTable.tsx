import { OrderBookEntry } from "@/models/orderbook";
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, Typography, TableBody } from "@mui/material";

// TODO Add cumulative volume (sum of prev. quantities + self)
const columns: readonly any[] = [
    { id: 'price', label: 'Price' },
    { id: 'quantity', label: 'Quantity', align: 'right' },
];

// TODO A generic table component should be created or use better 3rd party grids (e.g. AGGrid)
export default function OrderBookTable({ data, hideHeader }: { data: OrderBookEntry[]; hideHeader?: boolean }) {
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={20}>
            <TableContainer>
                <Table stickyHeader aria-label="orderbook table" size="small">
                    {!hideHeader && (
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}>
                                        <Typography variant="caption">{column.label}</Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>)}
                    <TableBody>
                        {data.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.price}>
                                    {columns.map((column) => {
                                        const value = row[column.id as keyof OrderBookEntry];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number'
                                                    ? column.format(value)
                                                    : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}