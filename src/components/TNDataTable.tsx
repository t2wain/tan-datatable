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
    if (dt) {
      destroy(dt);
      console.log("re-init data table.");
    }

    // A one time setup of the DataTable when the component mounted
    const ldt = init(htmlTableRef.current as HTMLTableElement, colDefs, order, tblData);
    setDt(ldt);
    console.log("mounted");
    return () => {
      // cleanup when component unmounted
      destroy(ldt);
      setDt(undefined);
      console.log("unmounted");
    }
  }, [colDefs]);


  useEffect(() => {
    // re-rendering of the DataTable is done by JQuery
    if (dt) {
      reloadTableData(dt, tblData);
      if (tblData && tblData.length > 0) initHeaderFilters(dt);
      else clearFilter(dt);
      console.log("refresh: ", tblData ? tblData.length : 0);
    }
  }, [tblData, colDefs]) // run only when the data changed



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
