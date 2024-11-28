frappe.ui.form.on("Delivery Note", {
    refresh: function (frm) {
        if (frm.doc.status !== "Draft" && frm.doc.status !== "Cancelled") {
            frm.add_custom_button(
                __("Crates Return"),
                function () {
                    // Collect all items with `custom_is_companny_provided_item` set to true
                    let items_to_return = frm.doc.items.filter(row => row.custom_is_companny_provided_item && row.custom_is_return == 0);

                    if (items_to_return.length > 0) {
                        // Open new Stock Entry form
                        frappe.model.with_doctype("Stock Entry", () => {
                            let new_doc = frappe.model.get_new_doc("Stock Entry");
                            new_doc.stock_entry_type = "Crates Return";
                            new_doc.custom_delivery_note = frm.doc.name;

                            // Add rows to the items child table
                            items_to_return.forEach(row => {
                                let child_row = frappe.model.add_child(new_doc, "items");
                                child_row.item_code = row.item_code;
                                child_row.qty = row.qty;
                                child_row.uom = row.uom;
                                child_row.t_warehouse = row.warehouse;
                                child_row.transfer_qty = row.stock_qty;
                                child_row.conversion_factor = row.conversion_factor;
                                child_row.custom_delivery_note_item = row.name                                // Target warehouse
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
