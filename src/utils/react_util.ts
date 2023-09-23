/**
 * Implement a custom hook to call web service while providing
 * loading status and message for the waiting React component.
 * 
 */

import { useState } from "react";

type FuncAsync = () => Promise<any>;
export type FuncResult = { success: boolean, data: any };

export function useAsyncStatus(funcAsync: FuncAsync) {

  const [loading, setLoading] = useState(false);

  const callFuncAsync = async (): Promise<FuncResult> => {
    setLoading(true);

    let result = { success: false, data: null };
    try {
      result = { success: true, data: await funcAsync() };
    }
    catch (err: any) {
      result = { success: false, data: err };
    }

    setLoading(false);
    return result;
  };

  return [loading, callFuncAsync];
}
