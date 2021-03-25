import { importExcel } from './data-loader.js'
import { setupCommandActions } from './commands.js'

const columnDefs = [
    { field: "Ticker" },
    { field: "Coupon" },
    { field: "CUSIP" },
    { field: "Maturity" },
    { field: "M" },
    { field: "S&P" },
    { field: "F" },
    { field: "Amt Out" },
    { field: "BM Desc" },
    { field: "Issue Date" },
];

function getContextMenuItems(params) {
    // params not currently used, but they have the context of 
    // the value in the cell which the right click event was triggered by
    return [...Object.values(setupCommandActions())];
}

// let the grid know which columns and what data to use
const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        resizable: true,
        minWidth: 80,
        flex: 1
    },
    rowData: [],
    enableRangeSelection: true,
    allowContextMenuWithControlKey: true,
    getContextMenuItems: getContextMenuItems,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    setupCommandActions();
    const gridDiv = document.querySelector('#securitiesGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    importExcel(gridOptions);
});