import React, { useEffect, useState } from "react";
import { ConfigColumns } from 'datatables.net-dt';
import { useAsyncStatus, FuncResult } from "../utils/react_util";
import { ColSortOrder } from "../utils/datatable_util";
import TNDataTable from "./TNDataTable";
import { getExampleData } from "../data/api";


// DataTable column configuration
const colDefs: ConfigColumns[] = [
  {
    title: "Store", // table column header
    data: "keyStoreName", // property name of the data row
    width: "15%",
    className: "select-filter", // mark column need filtering
  },
  {
    title: "Site",
    data: "siteCity",
    width: "5%",
    className: "select-filter",
  },
  {
    title: "Tag",
    data: "productTag",
    width: "5%",
    className: "select-filter",
  },
  {
    title: "User",
    data: "userName",
    width: "5%",
    className: "select-filter",
  },
  {
    title: "Machine",
    data: "machineName",
    className: "select-filter",
    width: "5%",
  },
  {
    title: "Request",
    data: "requestTime",
    type: "date",
    width: "15%",
  },
  {
    title: "Return",
    data: "returnTime",
    type: "date",
    width: "15%",
  },
  {
    title: "Project",
    data: "projectName",
    width: "5%",
    className: "select-filter",
  },
  {
    title: "Use",
    className: "dt-body-right",
    data: "usageMinutes",
    width: "5%",
  },
  {
    title: "Source",
    data: "source",
    width: "5%",
    className: "select-filter",
  },
];


// DataTable column initial sort order
const order: ColSortOrder = [[6, "desc"]];


const TableExample: React.FC = (props): JSX.Element => {

  // setup a closure to capture the refresh variable
  let refresh = false;
  const getData = () => getExampleData(refresh);

  const [tblData, setTblData] = useState<any[]>([]);
  const [message, setMessage] = useState("");


  // calling custom hook to load the data
  const [
    loading, // disable the refresh btn while waiting for the data
    callFuncAsync // function to reload the data
  ] = useAsyncStatus(getData) as [boolean, () => Promise<FuncResult>];


  function loadData() {
    setMessage("Load data. Please wait...");
    callFuncAsync()
      .then(result => {
        setTblData(result.success ? result.data : []);
        setMessage(result.success ? "" : "Loading data failed. An error has occurred.");
        refresh = false;
      });
  }

  useEffect(() => loadData(), []);

  function Refresh() {
    // call the web service
    // false: get the data from cache
    refresh = true;
    setTblData([]); // clear the data
    loadData();
  }

  return (
    <div>
      <h2 className="h2 text-center">Data Table with React Typescript</h2>
      <div className="mt-5 mb-3">
        <button className="btn btn-primary" disabled={loading} onClick={Refresh}>Refresh</button>
        <span className={(message ? "visible" : "invisible") + " mx-3 py-1 px-2 text-bg-success bg-opacity-50"}>{message}</span>
      </div>
      {/* Display the data in the DataTable */}
      <TNDataTable {...{ tblData, colDefs, order }} />
    </div>
  );
};

export default TableExample;
