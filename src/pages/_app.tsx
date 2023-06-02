import Layout from "@/components/layouts/layout/Layout";
import store from "@/store/store";
import createEmotionCache from "@/styles/createEmotionCache";
import theme from "@/styles/theme";
import { EmotionCache, CacheProvider, ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { AppProps } from "next/app";
import Head from 'next/head';
import { Provider } from "react-redux";

// Note: Template Code copied to make Material UI and Next.js work together: https://github.com/mui/material-ui/tree/master/examples/material-next-ts

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  
  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
      <Head>
        <title>Trading Dashboard</title>
        <meta name="description" content="Trading Dashboard for Binance Demo Account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
    </Provider>
    
  );
}