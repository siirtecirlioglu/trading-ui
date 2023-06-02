import { Box, Stack } from "@mui/material";
import { Inter } from "next/font/google";
import Footer from "../Footer";
import Navigation from "../Navigation";
import styles from "./Layout.module.css";

const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }: { children: any }) {
    return (
        <main className={`${styles.main} ${inter.className}`}>
            <Stack className={`${styles.root}`} spacing={2}>
                <Navigation />
                <div className={`${styles.content}`}>{children}</div>
                <Footer />
            </Stack>
        </main>

    );
}