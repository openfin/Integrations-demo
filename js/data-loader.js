function makeRequest(method, url, success, error) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.responseType = "arraybuffer";

    httpRequest.open(method, url);
    httpRequest.onload = function () {
        success(httpRequest.response);
    };
    httpRequest.onerror = function () {
        error(httpRequest.response);
    };
    httpRequest.send();
}

function convertDataToWorkbook(data) {
    /* convert data to binary string */
    var data = new Uint8Array(data);
    var arr = new Array();

    for (var i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
    }

    var bstr = arr.join("");

    return XLSX.read(bstr, { type: "binary" });
}

function populateGrid(workbook, gridOptions) {
    // our data is in the first sheet
    var firstSheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[firstSheetName];

    // we expect the following columns to be present

    var columns = {
        'A': 'Ticker',
        'B': 'Coupon',
        'C': 'CUSIP',
        'D': 'Maturity',
        'E': 'M',
        'F': 'S&P',
        'G': 'F',
        'H': 'Amt Out',
        'I': 'BM Desc',
        'J': 'Issue Date'
    };

    var rowData = [];

    // start at the 2nd row - the first row are the headers
    var rowIndex = 2;

    // iterate over the worksheet pulling out the columns we're expecting
    while (worksheet['A' + rowIndex]) {
        var row = {};
        Object.keys(columns).forEach(function (column) {
            let value = worksheet[column + rowIndex];
            if (value) {
                row[columns[column]] = value.w;
            } else {
                row[columns[column]] = "";
            }
        });

        rowData.push(row);

        rowIndex++;
    }

    // finally, set the imported rowData into the grid
    gridOptions.api.setRowData(rowData);
}

export function importExcel(gridOptions) {
    makeRequest('GET',
        'data/OpenFinBBGPOC_Data.xlsx',
        // success
        function (data) {
            var workbook = convertDataToWorkbook(data);

            populateGrid(workbook, gridOptions);
        },
        // error
        function (error) {
            throw error;
        }
    );
}