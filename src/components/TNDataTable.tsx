import React, { useRef, useEffect, useState } from "react";
import { Api, ConfigColumns } from 'datatables.net-dt';
import { init, ColSortOrder, destroy, reloadTableData, clearFilter, initHeaderFilters } from "../utils/datatable_util";


export interface TNDataTableProp {
  tblData: any[],
  colDefs: ConfigColumns[],
  order: ColSortOrder
};


export const TNDataTable: React.FC<TNDataTableProp> = ({ tblData, colDefs, order }): JSX.Element => {
  const htmlTableRef = useRef<HTMLTableElement>(null);
  const [dt, setDt] = useState<Api<any> | undefined>();


  useEffect(() => {
    // A one time setup of the DataTable when the component mounted
    const dt = init(htmlTableRef.current as HTMLTableElement, colDefs, order, tblData);
    setDt(dt);
    console.log("mounted");
    return () => {
      // cleanup when component unmounted
      destroy(dt);
      setDt(undefined);
      console.log("unmounted");
    }
  }, []); // ensure only run once


  useEffect(() => {
    // re-rendering of the DataTable is done by JQuery
    if (dt) {
      reloadTableData(dt, tblData);
      if (tblData && tblData.length > 0) initHeaderFilters(dt);
      else clearFilter(dt);
      console.log("refresh: ", tblData ? tblData.length : 0);
    }
  }, [tblData]) // run only when the data changed



  return (
    <div>
      {/* 
        Expect that React will never re-render this element
        since it is not depended on any state.
        All update will be done by JQuery.  
      */}
      <table
        className="table table-condensed table-bordered table-striped"
        ref={htmlTableRef}
      />
    </div>
  );
};

export default TNDataTable;
