import { importExcel } from './data-loader.js';
import { setupCommandActions } from './commands.js';
import { setSecurity, initBloombegConnection } from './bloomberg-service.js';
import '../styles/main.css';

let shouldSyncWithBloomberg = false;

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
    return [...Object.values(setupCommandActions(params))];
}

function onSelectionChanged() {
    var selectedRows = gridOptions.api.getSelectedRows();
    if (selectedRows && selectedRows.length > 0 && shouldSyncWithBloomberg) {
        setSecurity(selectedRows[0].CUSIP)
    }
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
    rowSelection: 'single',
    onSelectionChanged: onSelectionChanged,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', async () => {
    //await initBloombegConnection();
    const syncWithBbcheckBox = document.getElementById("syncWithBbCheckbox");
    syncWithBbcheckBox.onclick = (_) => {
        shouldSyncWithBloomberg = syncWithBbcheckBox.checked;
    };

    const gridDiv = document.querySelector('#securitiesGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    importExcel(gridOptions);
});