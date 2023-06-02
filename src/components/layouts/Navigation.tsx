import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Navigation() {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Trading Dashboard
                </Typography>
                <div>
                    <IconButton
                        size="large"
                        aria-label="current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit">
                        <AccountCircle />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    )
}