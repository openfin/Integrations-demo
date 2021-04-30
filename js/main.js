import { importExcel } from './data-loader.js';
import { setupCommandActions } from './commands.js';
import * as fdc3 from 'openfin-fdc3';
import { setSecurity, initBloombegConnection } from './bloomberg-service.js';
import { create } from 'openfin-notifications';
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

const selectGridRow = (cusip) => {
    gridOptions.api.forEachNode(function (node) {
        node.setSelected(node.data.CUSIP === cusip);
    });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', async () => {
    const syncWithBbcheckBox = document.getElementById("syncWithBbCheckbox");
    syncWithBbcheckBox.onclick = (_) => {
        shouldSyncWithBloomberg = syncWithBbcheckBox.checked;
    };

    const gridDiv = document.querySelector('#securitiesGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    await initBloombegConnection(selectGridRow);

    fdc3.addContextListener((context) => {
        const ticker = context.id.ticker;
        const cusip = context.id.CUSIP;
        selectGridRow(ticker);
        create({
            title: "Context Changed",
            body: `New context switched to ${ticker} (${cusip}).`,
            category: "default",
            catalogId: "0de8995a-9925-4938-8f64-adf33cfc998d",
            indicator: {
                type: "success",
                text: "ticker"
            }
        });
    });

    importExcel(gridOptions);
});