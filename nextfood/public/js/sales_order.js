frappe.ui.form.on("Sales Order Item", "item_code", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    
    // Set a 15-second timer to update the 'qty' field
    setTimeout(function() {
        frappe.model.set_value(cdt, cdn, "qty", 0);
    }, 200); // 15000 milliseconds = 15 seconds
});
