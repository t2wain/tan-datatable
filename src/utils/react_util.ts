/**
 * Implement a custom hook to call web service while providing
 * loading status and message for the waiting React component.
 * 
 */

import { useState } from "react";

type FuncAsync<T> = (arg? : T | undefined) => Promise<any>;
export type FuncResult = { success: boolean, data: any };

export function useAsyncStatus<T>(funcAsync: FuncAsync<T>) : [boolean, FuncAsync<T>] {

  const [loading, setLoading] = useState(false);

  const callFuncAsync : FuncAsync<T> = async (arg?) => {
    setLoading(true);

    let result = { success: false, data: null };
    try {
      result = { success: true, data: await funcAsync(arg) };
    }
    catch (err: any) {
      result = { success: false, data: err };
    }

    setLoading(false);
    return result;
  };

  return [ loading, callFuncAsync ];
}
