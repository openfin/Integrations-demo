const columnDefs = [
    { field: "security" },
    { field: "price" }
];

// specify the data
const rowData = [
    { security: "IBM US Equity", price: 35000 },
    { security: "VOD LN Equity", price: 32000 },
];

// let the grid know which columns and what data to use
const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#securitiesGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});