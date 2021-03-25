import { importExcel } from './data-loader.js'

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

const supportedBbgCommands = ["YAS", "DES", "YASQ", "PSU", "PSU1", "QMGR", "HDS", "COV", "ATS"];
const commandActions = {};
function setupCommandActions() {
    supportedBbgCommands.forEach(command => {
        commandActions[command] = {
            name: command,
            action: function () {
                window.alert('Alerting about ' + command);
            }
        }
    });
}
function getContextMenuItems(params) {
    var result = [...Object.values(commandActions)];

    return result;
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