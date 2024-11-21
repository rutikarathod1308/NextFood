// frappe.ui.form.on("MILK Rate", {
//     refresh(frm) {
//         frm.fields_dict["fatsnf_rate"].grid.add_custom_button(__('Download'), function () {
//             // Fetch child table data
//             const childTableData = frm.doc.fatsnf_rate;
//             const fieldMapping = {};

//             // Define a mapping of custom field names to child table field names
//             frm.fields_dict["fatsnf_rate"].grid.docfields.forEach(childField => {
//                 if (childField.fieldname !== 'name' && 
//                     childField.fieldtype !== 'Column Break' && 
//                     childField.fieldtype !== 'Section Break') {
//                     fieldMapping[childField.fieldname] = childField.fieldname;
//                 }
//             });

//             // Format data into rows and columns like in the image
//             const formattedData = [];

//             // Assuming that the child table has rows that you want to structure in a matrix-like format
//             const headerRow = ["Fat"," SNF/CLR", "8", "8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7", "8.8", "8.9", "9", "9.1", "9.2"];
//             formattedData.push(headerRow);  // First row as header

//             // Add rows for each "category" (like SNF, etc.) and corresponding rates
//             childTableData.forEach(row => {
//                 const dataRow = [];
//                 dataRow.push(row["category"]);  // Assuming 'category' is a field for different rates like SNF

//                 // Add rate values
//                 for (let i = 8; i <= 9.2; i += 0.1) {
//                     const field = i.toFixed(1);  // Assuming the rates are stored in fields like 'rate_8.0'
//                     dataRow.push(row[field] || "");  // Use empty string if value is undefined
//                 }

//                 formattedData.push(dataRow);
//             });

//             // Create CSV string with formatted data
//             const csvContent = "data:text/csv;charset=utf-8,"
//                 + formattedData.map(row => row.join(',')).join('\n');

//             // Create a temporary anchor element to trigger the download
//             const anchor = document.createElement('a');
//             anchor.href = encodeURI(csvContent);
//             anchor.target = '_blank';
//             anchor.download = 'Milk Rate.csv';
//             anchor.click();
//         });

//         // Change button style to match the primary color
//         frm.fields_dict["fatsnf_rate"].grid.grid_buttons.find('.btn-custom').removeClass('btn-default').addClass('btn-primary');
//     }
// });


frappe.ui.form.on('MILK Rate', {
    refresh(frm) {
      

        frm.fields_dict["fatsnf_rate"].grid.add_custom_button(__('Download'), function () {
            const childTableData = frm.doc.fatsnf_rate;
        
            const columns = [
                'S NO', 
                'Fat',
                'SNF/CLR',
                '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', 
                '6.0', '6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9', 
                '7.0', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9', 
                '8.0', '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', 
                '9.0', '9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '9.7', '9.8', '9.9', 
                '10.0'
            ];
        
            let csvContent = columns.join(',') + '\n';
        
            // Map data to rows
            csvContent += childTableData.map((row, index) => {
                return [
                    index + 1, 
                    row.fat ? row.fat.toFixed(2) : '', 
                    row.snfclr || '', // Example additional field
                    ...columns.slice(3).map((col) => {
                        const rateField = `rate_${col.replace('.', '')}`;
                        return row[rateField] ? row[rateField].toFixed(2) : '';
                    })
                ].join(',');
            }).join('\n');
        
            const anchor = document.createElement('a');
            anchor.href = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
            anchor.target = '_blank';
            anchor.download = 'fatsnf_rate.csv';
            anchor.click();
        });
        

        // Change button style to match the primary color
        frm.fields_dict["fatsnf_rate"].grid.grid_buttons.find('.btn-custom').removeClass('btn-default').addClass('btn-primary');
    
    }
});

frappe.ui.form.on("MILK Rate", {
    refresh(frm) {
        // Add custom "Download" button
        frm.fields_dict["fatsnf_rate"].grid.add_custom_button(__('Download'), function () {
            // Your existing CSV download logic (from previous code) here
        });

        // Add custom "Upload" button
        frm.fields_dict["fatsnf_rate"].grid.add_custom_button(__('Upload'), function () {
            // Create a file input element dynamically
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.csv,.xls';  // Allow CSV or Excel files

            // Trigger the file selection when the file input changes
            fileInput.addEventListener('change', function (event) {
                handleFileUpload(event.target.files[0], frm);  // Pass the form instance
            });

            // Trigger the file input click event
            fileInput.click();
        });

        // Change button style to match the primary color
        frm.fields_dict["fatsnf_rate"].grid.grid_buttons.find('.btn-custom').removeClass('btn-default').addClass('btn-primary');
    }
});

// Handle file upload (CSV or XLSX)
function handleFileUpload(file, frm) {
    if (!file) {
        frappe.msgprint(__('No file selected.'));
        return;
    }

    // If file is CSV
    if (file.name.endsWith('.csv')) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var csvData = event.target.result;
            processData(csvData, frm);
        };
        reader.readAsText(file);
    } 
    // If file is XLSX (Excel format)
    else if (file.name.endsWith('.xls')) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var excelData = event.target.result;
            processExcelData(excelData, frm);  // Process Excel data
        };
        reader.readAsArrayBuffer(file);
    }
    else {
        frappe.msgprint(__('Invalid file format. Only CSV and XLSX are supported.'));
    }
}

// Process CSV data
function processData(csvData, frm) {
    var lines = csvData.split('\n');
    var fieldNames = lines[0].split(','); // Assuming the first row contains headers.

    // Remove the header line from the lines array.
    lines.splice(0, 1);

    var pressItems = [];
    for (var i = 0; i < lines.length; i++) {
        var values = lines[i].split(',');

        // Skip empty lines.
        if (values.length === 1 && values[0].trim() === '') {
            continue;
        }

        var pressItem = {};
        for (var j = 0; j < fieldNames.length; j++) {
            var fieldName = fieldNames[j].trim(); // Header value.
            var value = values[j] ? values[j].trim() : null; // Row value.

            // Map each field dynamically.
            if (fieldName === "S NO") {
                pressItem.idx = parseInt(value) || 0; // Use `idx` for sequence number.
            } else if (fieldName === "Fat") {
                pressItem.fat = parseFloat(value) || 0;
            } else if (fieldName === "SNF/CLR") {
                pressItem.snfclr = value || "";
            } else {
                // For dynamic rate fields (e.g., 8, 8.1, ..., 9.2).
                if (!pressItem.rates) pressItem.rates = {};
                pressItem[`rate_${fieldName.replace('.', '')}`] = parseFloat(value) || 0;
            }
        }

        pressItems.push(pressItem);
    }

    // Clear existing child table rows.
    frm.clear_table('fatsnf_rate');

    // Add new child table rows based on the parsed data.
    pressItems.forEach((item) => {
        let child = frm.add_child('fatsnf_rate');
        child.fat = item.fat;
        child.snfclr = item.snfclr;

        // Map dynamic rate fields.
        for (const [key, value] of Object.entries(item)) {
            if (key.startsWith("rate_")) {
                child[key] = value;
            }
        }
    });

    // Refresh the child table to display the newly added rows.
    frm.refresh_field('fatsnf_rate');

    frappe.msgprint(__('Data has been successfully imported.'));
}

// Process XLSX data (using a library like xlsx.js or sheetjs)
function processExcelData(excelData, frm) {
    // Use SheetJS to parse the Excel data
    var workbook = XLSX.read(excelData, { type: 'array' });
    var sheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first sheet
    var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    var fieldNames = jsonData[0];  // First row as field names
    jsonData.splice(0, 1);  // Remove the header row from the data

    var pressItems = [];
    for (var i = 0; i < jsonData.length; i++) {
        var values = jsonData[i];

        var pressItem = {};
        for (var j = 0; j < fieldNames.length; j++) {
            var fieldName = fieldNames[j].trim();
            var value = values[j] ? values[j].toString().trim() : "";

            pressItem[fieldName] = value;
        }

        pressItems.push(pressItem);
    }

    // Clear existing child table rows
    frm.clear_table('fatsnf_rate');

    // Add new child table rows based on the Excel data
    for (var k = 0; k < pressItems.length; k++) {
        var child = frm.add_child('fatsnf_rate', pressItems[k]);
    }

    // Refresh the child table to display the newly added rows
    frm.refresh_field('fatsnf_rate');

    frappe.msgprint(__('Excel data has been successfully loaded into the child table.'));
}
