/**
 * Implement a custom hook to call web service while providing
 * loading status and message for the waiting React component.
 * 
 */

import { useEffect, useState } from "react";

type GetDataFunc = (refresh: boolean) => Promise<any>;

export function useData(getData: GetDataFunc) {
  const [tblData, setTblData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // get data from cache if available
    // otherwise from API
    retrieveData(false);
  }, []);

  const retrieveData = (refresh: boolean) => {
    setMessage("Please wait. Retrieving data....");
    setLoading(true); // start loading
    // clear data
    setTblData([]);
    // get data from API if refresh
    // or from brower session storage
    getData(refresh)
      .then((data) => {
        setLoading(false); // finish loading
        setTblData(data); // populate data in table
        setMessage("");
      })
      .catch((err) => {
        setMessage("Failed to retrieve data. Please refresh the data again.");
        setLoading(false); // finish loading
      });
  };

  return [tblData, loading, message, retrieveData];
}
