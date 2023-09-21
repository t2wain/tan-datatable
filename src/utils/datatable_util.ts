/**
 * Implement functions to initalize and cleanup the DataTable,
 * setup the column filter, reloading the table data. JQuery is
 * being used to manipuate the DOM instead of React. Therefore,
 * it is important to track which DOM element is manipulated by
 * which libraries.
 * 
 */


import $ from 'jquery';
import DataTable, { Api, ApiColumnsMethods, ConfigColumns } from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.html5'; // csv button


export type ColSortOrder = [[number, "asc" | "desc"]];

type DTO = { [key: string]: string }
// type FunctionInitComplete = (settings: InternalSettings, json: object) => void;
// type InternalSettings = Object;

/**
 * dom options
 * 
 * l - length changing input control
 * f - filtering input
 * t - The table!
 * i - Table information summary
 * p - pagination control
 * r - processing display element
 * 
 * < and > - div element
 * <"class" and > - div with a class
 * <"#id" and > - div with an ID
 * <"#id.class" and > - div with an ID and a class
 */

// initialize the DataTable object on the HTML table element
export function init(ntbl: HTMLTableElement, colDefs: ConfigColumns[],
  colSortOrders: ColSortOrder, tblData: any[]): Api<any> {
  const dt = new DataTable(ntbl, {
    dom:
      "<'row'<'col-sm-12 col-md-6'lB><'col-sm-12 col-md-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    data: tblData,
    columns: colDefs,
    ordering: true,
    searching: true,
    pageLength: 100,
    order: colSortOrders,
    buttons: ['csvHtml5'],
    initComplete: createColumnHeader, // FunctionInitComplete
  });

  return dt;
}


// clean up the JQuery DataTable object
export function destroy(dt: Api<any>) {
  // unregister all event listener
  // of the select element.
  rmSelect(dt.table());
  dt.destroy(true);
}


// reload the data on the DataTable object
export function reloadTableData(dt: Api<any>, tblData: any[]) {
  dt.clear();
  dt.rows.add(tblData);
  dt.draw();
}


// This function is intended to be called by 
// the DataTable during init. The 'this' parameter
// is passed in by the DataTable.
// FunctionInitComplete
function createColumnHeader(settings: object, json: object) {
  const api: Api<any> = new $.fn.dataTable.Api(settings);

  // add another row to the table header
  const h1 = api.table().header() as HTMLElement;
  const h2 = $('<tr row="row"></tr>').prependTo(h1);

  const cols = api.columns() as ApiColumnsMethods;
  // add the table cell to the header
  cols.every(() => {
    $(h2).append("<th></th>");
  });

  // get the header cells
  const fcells = $("th", h2);
  const colSets = api.table().init().columns as ConfigColumns[];

  // setup filtering for columns with class '.select-filter'
  api.columns(".select-filter").every(function () {
    const column = this;
    // get the header cell
    const ft = fcells.get(column.index()) as HTMLElement;
    const col = colSets[column.index()];

    // Create the select element
    // name the select element based on data field of the column
    const select = $(
      '<select name="' +
      col.data +
      '" class="round p-1 align-middle" style="max-width:10rem"><option value="ALL">ALL</option></select>'
    )
      .appendTo(ft) // append to header cell
      .on("change", function () {
        // setup event listener on select element
        const m = $(this).val() as string;
        const v = m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // perform the table filtering
        if (v == "ALL") column.search("").draw();
        else column.search("^" + v + "$", true, false, true).draw();
      });
  });
}


function rmSelect(dt: Api<any>) {
  const h1 = dt.table().header();
  // get all select elements in the header row
  const sel = $("select", h1);
  // expect all event listeners
  // on the select element are
  // also unregistered.
  sel.remove();
}


// setup the column filters when data for the
// DataTable changed.
export function initHeaderFilters(dt: Api<any>) {
  // get the table header
  const hrow = $("tr", dt.table().header()).get(0);
  const hcells = $("th", hrow);

  // get the columns configured for filtering
  dt.columns(".select-filter").every(function () {
    var column = this;

    // get the select element for each column
    const ft = hcells.get(column.index());
    const select = $("select", ft);
    // save the current value of the select element
    const curVal = select.val() as string;
    // re-populate the option element of the select
    select.empty().append('<option value="ALL">ALL</option>');

    this.data() // get the data of the column
      .unique() // get the unique value only
      .sort() // sort the data
      .each(function (d, j) {
        if (d != null)
          // create the option element for each data value
          select.append('<option value="' + d + '">' + d + "</option>");
      });

    // set the previous current value for each select element
    if ($("option[value='" + curVal + "']", select).length > 0) {
      select.val(curVal);
      select.change();
    }
  });
}

export function getFilterValue(dt: Api<any>) {
  const h1 = dt.table().header();
  let facc: DTO = {};
  $("select", h1)
    .toArray()
    .forEach(s => {
      let sel = s as HTMLSelectElement;
      const n = s.getAttribute("name")?.valueOf() || "error";
      facc[n] = sel.value;
    });
  return facc;
}


export function clearFilter(dt: Api<any>) {
  dt.columns(".select-filter").every(function () {
    var column = this;
    column.search("").draw();
  });
}

// currently not being used
export function createColumnFooter(settings: object, json: object) {
  createColumnHeader(settings, json);
  const api: Api<any> = new $.fn.dataTable.Api(settings);
  const f1 = api.table().footer() as HTMLElement;
  const footer = $('<tfoot><tr></tr></tfoot>').append(f1);
  const frow = $("tfoot tr");
  const cols = api.columns() as ApiColumnsMethods;
  cols.every(() => {
    $(frow).append("<td></td>");
  });
  const fcells = $("tfoot tr td");

  api.columns(".select-filter").every(function () {
    var column = this;
    const ft = fcells.get(column.index()) as HTMLElement;

    // Create the select list and search operation
    const select = $('<select><option value=""></option></select>')
      .appendTo(ft)
      .on("change", function () {
        const v = $(this).val();
        if (v == "ALL") column.search("").draw();
        else column.search("^" + $(this).val() + "$", true, false, true).draw();
      });
  });
}
