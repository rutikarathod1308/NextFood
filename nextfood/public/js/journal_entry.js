frappe.ui.form.on("Journal Entry", {
    refresh(frm) {
        frm.add_custom_button(__('Sales Invoice'), function() {
            // Get yesterday's date in YYYY-MM-DD format
            let yesterday = frappe.datetime.add_days(frappe.datetime.now_date(), -1);

            var d = new frappe.ui.form.MultiSelectDialog({
                doctype: "Sales Invoice",
                target: frm,
                setters: {
                    territory: frm.doc.custom_territory,
                    posting_date: ["=", yesterday],  // Filter for yesterday's invoices
                   
                },
                
                // filters: {
                  
                //     status: ["!=", "Paid"],         // Filter for invoices with status not equal to "Paid"
                //     outstanding_amount: [">", 0]    // Filter for invoices with outstanding amounts > 0
                // },
                add_filters_group: 1, // Allow filters group
                get_query() {
                    return {
                        filters: {
                  
                            status: ["!=", "Paid"],         // Filter for invoices with status not equal to "Paid"
                            outstanding_amount: [">", 0]    // Filter for invoices with outstanding amounts > 0
                        },
                    }
                },
                // Action to handle selected records
                action(selections) {
                    console.log("Selected Sales Invoices:", selections);

                    // Fetch each selected Sales Invoice and process data
                    let promises = selections.map(invoice_name => {
                        return new Promise((resolve, reject) => {
                            frappe.call({
                                method: "frappe.client.get",
                                args: {
                                    doctype: "Sales Invoice",
                                    name: invoice_name
                                },
                                callback: function(response) {
                                    if (response.message) {
                                        resolve(response.message);
                                    } else {
                                        resolve(null);
                                    }
                                },
                                error: reject
                            });
                        });
                    });

                    // Wait for all API calls to complete
                    Promise.all(promises).then(invoices => {
                        // Filter out null responses
                        invoices = invoices.filter(Boolean);

                        // Clear the Accounts child table
                        frm.clear_table("accounts");

                        // Add entries to the Accounts child table
                        invoices.forEach(invoice => {
                            let row = frm.add_child("accounts");
                            row.account = invoice.debit_to; // Set debit account
                            row.party_type = "Customer";
                            row.party = invoice.customer;
                            row.credit_in_account_currency = invoice.outstanding_amount;
                            row.credit = 0;
                            row.reference_type = "Sales Invoice";
                            row.reference_name = invoice.name; // Invoice number as reference
                        });

                        // Refresh the Accounts child table to display the new rows
                        frm.refresh_field("accounts");

                        frappe.msgprint({
                            title: __('Success'),
                            message: __('Selected invoices have been added to the Accounts child table.'),
                            indicator: 'green'
                        });
                    }).catch(error => {
                        frappe.msgprint({
                            title: __('Error'),
                            message: __('Failed to fetch invoices. Please try again.'),
                            indicator: 'red'
                        });
                        console.error("Error fetching invoices:", error);
                    });

                    // Hide the dialog
                    d.dialog.hide();
                }
            });
        });
    }
});
