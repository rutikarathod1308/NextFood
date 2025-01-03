frappe.ui.form.on("Additional Salary",{
	validate: function(frm)
{
    if (frm.doc.custom_is_employee_item) {
    var a = 0;
    $.each(frm.doc.custom_employee_items, function(i, d) {

            a += d.amount;
    });
    frm.set_value("amount",a);
    frm.refresh_field("amount");
    }
}});
frappe.ui.form.on("Additional Salary", {
    after_save: function (frm) {
        if (frm.doc.custom_is_employee_item) {

            if (Array.isArray(frm.doc.custom_employee_items) && frm.doc.custom_employee_items.length > 0) {

                // Ensure we only trigger auto-save once
                if (frm.is_newly_saved) {
                    frm.is_newly_saved = false; // Reset the flag
                    return;
                }

                // Group items by posting_date
                let grouped_items_by_date = {};
                frm.doc.custom_employee_items.forEach((row) => {
                    if (!row.posting_date || row.is_delivered) return; // Skip items with no posting date or already delivered
                    if (!grouped_items_by_date[row.posting_date]) {
                        grouped_items_by_date[row.posting_date] = [];
                    }
                    grouped_items_by_date[row.posting_date].push(row);
                });

                // Check if there are any items to process
                if (Object.keys(grouped_items_by_date).length === 0) {
                    frappe.msgprint({
                        title: __("Info"),
                        message: __("All items are already delivered or no valid items available."),
                        indicator: "blue",
                    });
                    return;
                }

                // Process grouped items and create Stock Entry for each unique posting date
                let updates_made = false;
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
                                // Update the child table with the corresponding Stock Entry details
                                items.forEach((row, index) => {
                                    if (response.message[index]) {
                                        const stock_entry = response.message[index];
                                        frappe.model.set_value(row.doctype, row.name, "is_delivered", 1);
                                        frappe.model.set_value(row.doctype, row.name, "stock_entry", stock_entry);
                                        updates_made = true;
                                    }
                                });

                                if (updates_made) {
                                    frm.refresh_field("custom_employee_items");
                                    frm.is_newly_saved = true; // Set the flag for auto-save
                                    frm.save(); // Save the form again after updates
                                }
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


frappe.ui.form.on("Employee Items", {
    rate: function (frm, cdt, cdn) {
        update_amount(cdt, cdn);
    },
    qty: function (frm, cdt, cdn) {
        update_amount(cdt, cdn);
    },
});

// Utility function to calculate and update the amount
function update_amount(cdt, cdn) {
    const row = frappe.get_doc(cdt, cdn);
    const amount = (row.rate || 0) * (row.qty || 0);
    frappe.model.set_value(cdt, cdn, "amount", amount);
}
