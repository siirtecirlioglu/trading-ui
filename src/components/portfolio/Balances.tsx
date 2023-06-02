import { Balance } from "@/models/portfolio";
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, Typography, TableBody } from "@mui/material";

const columns: readonly any[] = [
    { id: 'asset', label: 'Asset' },
    { id: 'quantity', label: 'Quantity', align: 'right', format: (value: number) => value.toLocaleString() },
    { id: 'totalInUSDT', label: 'Total in USDT', align: 'right', format: (value: number) => value.toLocaleString() }
];

// TODO A generic table component should be created or use better 3rd party grids (e.g. AGGrid)
export default function Balances({ balances }: { balances: Balance[] }) {
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={20}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="balances table" >
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
                    </TableHead>
                    <TableBody>
                        {balances.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.asset}>
                                    {columns.map((column) => {
                                        const value = row[column.id as keyof Balance];
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
    );
}