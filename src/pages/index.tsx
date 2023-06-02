import styles from "./Home.module.css";
import { Box, Stack, Button } from "@mui/material";

export default function Home() {
  return (
    <Box className={`${styles.root}`}>
      <Stack spacing={4}>
        <h1>Welcome to the Trading Dashboard!</h1>
        <Button variant="contained" href="/dashboard">Start Trading!</Button>
      </Stack>
    </Box>    
  )
}