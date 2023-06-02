import { RESOURCE_REST_ENDPOINTS, signedRequest } from "@/utils/requests";
import { useEffect } from "react";

export default function useBalances() {
    useEffect(() => {
        async function fetchData() {
            const resp = await signedRequest(null, "GET", RESOURCE_REST_ENDPOINTS.ACCOUNT_INFO);
            if (resp.ok) {
                const data = await resp.json(); // TODO Create TS Interface for this
                console.log(data);
            } else {
                console.log('Couldnt fetch the submit order! Refresh page'); // TODO Retry mechanism or better alerting
            }
        }

        fetchData();
    }, []);
}
