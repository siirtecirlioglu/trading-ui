import styles from "./OrderForm.module.css";
import { Tabs, Tab } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import SpotOrderForm from './SpotOrderForm';
import MarginOrderForm from './MarginOrderForm';
import FuturesOrderForm from './FuturesOrderForm';
import { TabPanelProps } from '@/models/tabs';

enum OrderFormType {
  SPOT,
  MARGIN,
  FUTURES,
}

export default function OrderForm() {
  const [orderFormType, setOrderFormType] = useState(OrderFormType.SPOT);

  const handleChange = useCallback((event: React.SyntheticEvent, newValue: OrderFormType) => {
    setOrderFormType(newValue);
  }, []);

  // TODO Convert this to a nested layout
  return (
    <Paper className={`${styles.root}`} elevation={3}>
      <Typography variant="h6">ORDER FORM</Typography>
      <div className={`${styles.content}`}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={orderFormType} onChange={handleChange} aria-label="order form types">
            <Tab label={OrderFormType[OrderFormType.SPOT]} />
            <Tab label={OrderFormType[OrderFormType.MARGIN]} />
            <Tab label={OrderFormType[OrderFormType.FUTURES]} />
          </Tabs>
        </Box>
        <TabPanel value={orderFormType} index={OrderFormType.SPOT}>
          <SpotOrderForm />
        </TabPanel>
        <TabPanel value={orderFormType} index={OrderFormType.MARGIN}>
          <MarginOrderForm />
        </TabPanel>
        <TabPanel value={orderFormType} index={OrderFormType.FUTURES}>
          <FuturesOrderForm />
        </TabPanel>
      </div>
    </Paper>
  );
}

// TODO Tab and TabPanel should be a reusable component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-form-tabpanel-${index}`}
      aria-labelledby={`order-form-tab-${index}`}
      {...other}>
      {value === index && (
        <>
          {children}
        </>
      )}
    </div>
  );
}