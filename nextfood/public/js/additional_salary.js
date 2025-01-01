frappe.ui.form.on("Additional Salary", {
    after_save: function (frm) {
        if (frm.doc.custom_is_employee_item) {
            if (Array.isArray(frm.doc.custom_employee_items) && frm.doc.custom_employee_items.length > 0) {
                
                // Group items by posting_date
                let grouped_items_by_date = {};

                frm.doc.custom_employee_items.forEach((row) => {
                    if (!row.posting_date) return; // Skip items with no posting date
                    if (!grouped_items_by_date[row.posting_date]) {
                        grouped_items_by_date[row.posting_date] = [];
                    }
                    grouped_items_by_date[row.posting_date].push(row);
                });

                // Process grouped items and create Stock Entry for each unique posting date
                Object.keys(grouped_items_by_date).forEach((posting_date) => {
                    const items = grouped_items_by_date[posting_date];

                    frappe.call({
                        method: "nextfood.public.py.additional_salary.make_stock_entry",
                        args: {
                            doctype: frm.doc.doctype,
                            docname: frm.doc.name,
                            items: items,
                            employee: frm.doc.employee,
                        },
                        callback: function (response) {
                            if (response.message) {
                                // Success message
                                frappe.msgprint({
                                    title: __("Success"),
                                    message: __("Stock Entry created: ") + response.message.join(", "),
                                    indicator: "green",
                                });

                                // Update the child table with the corresponding Stock Entry details
                                items.forEach((row, index) => {
                                    // Update the row only if it was processed successfully
                                    if (response.message[index]) {
                                        const stock_entry = response.message[index];

                                        // Update 'is_delivered' and 'stock_entry' for each row
                                        frappe.model.set_value(row.doctype, row.name, "is_delivered", 1);
                                        frappe.model.set_value(row.doctype, row.name, "stock_entry", stock_entry);
                                    }
                                });

                                // Refresh the child table to display the updates
                                frm.refresh_field("custom_employee_items");

                                frappe.msgprint({
                                    title: __("Saved"),
                                    message: __("Child table updated with Stock Entry details."),
                                    indicator: "green",
                                });
                            } else {
                                frappe.msgprint({
                                    title: __("Error"),
                                    message: __("Failed to create Stock Entry."),
                                    indicator: "red",
                                });
                            }
                        },
                        error: function (error) {
                            frappe.msgprint({
                                title: __("Error"),
                                message: __("An error occurred while creating Stock Entry."),
                                indicator: "red",
                            });
                            console.error(error); // Log error for debugging
                        },
                    });
                });
            } else {
                frappe.msgprint({
                    title: __("Validation"),
                    message: __("No items available in Employee Items."),
                    indicator: "orange",
                });
            }
        }
    },
});
