frappe.ui.form.on("Sales Invoice", {
    validate: function (frm) {
        if(frm.doc.custom_is_customer_credit_limit){
        return new Promise((resolve, reject) => {
            var credit_amt = 0;
            var debit_amt = 0;

            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "GL Entry",
                    filters: {
                        party: frm.doc.customer,
                        voucher_type: ["in", ["Journal Entry", "Payment Entry", "Sales Invoice"]],
                        voucher_subtype: ["in", ["Journal Entry", "Debit Note", "Receive"]],
                        is_cancelled: 0
                    },
                    fields: ["credit", "debit"],
                    order_by: "posting_date desc, creation desc"
                },
                callback: function (r) {
                    if (r.message) {
                        var len = r.message.length;
                        for (var i = 0; i < len; i++) {
                            credit_amt += r.message[i].credit || 0; // Safeguard against undefined
                            debit_amt += r.message[i].debit || 0;
                        }

                        var unpaid_amt = credit_amt - debit_amt;

                        if (unpaid_amt < 0) {
                            frappe.throw({
                                title: 'Error',
                                message: 'Unable to create Bill Due To Pending Payment.',
                            });
                            frm.set_value('customer', "");
                            reject(); // Stop the process
                        } else {
                            resolve(); // Allow the process to continue
                        }
                    } else {
                        resolve(); // No entries found, allow the process to continue
                    }
                    
                },
               
            });
        });
    }
    }
});
frappe.ui.form.on("Sales Invoice", {
    refresh: function (frm) {
        if (frm.doc.status !== "Draft" && frm.doc.status !== "Cancelled") {
            frm.add_custom_button(
                __("Crates Return"),
                function () {
                    // Collect all items with `custom_is_companny_provided_item` set to true
                    let items_to_return = frm.doc.items.filter(row => row.custom_is_companny_provided_item && row.custom_return_qty != row.qty);

                    if (items_to_return.length > 0) {
                        // Open new Stock Entry form
                        frappe.model.with_doctype("Stock Entry", () => {
                            let new_doc = frappe.model.get_new_doc("Stock Entry");
                            new_doc.stock_entry_type = "Crates Return";
                            new_doc.custom_sales_invoice = frm.doc.name;

                            // Add rows to the items child table
                            items_to_return.forEach(row => {

                                let child_row = frappe.model.add_child(new_doc, "items");
                                child_row.item_code = row.item_code;
                                child_row.qty = row.qty - row.custom_return_qty;
                                child_row.uom = row.uom;
                                child_row.t_warehouse = row.warehouse;
                                child_row.transfer_qty = row.stock_qty;
                                child_row.conversion_factor = row.conversion_factor;
                                child_row.custom_delivery_note_item = row.name  ;
                                child_row.custom_delivery_bal_qty =  row.custom_return_qty  
                            });

                            // Redirect to the new Stock Entry document
                            frappe.set_route("Form", "Stock Entry", new_doc.name);
                        });
                    } else {
                        frappe.msgprint(__('No items marked for crates return.'));
                    }
                },
                __("Create") // Specifies the button group
            );
        }
    },
});
