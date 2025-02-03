frappe.ui.form.on("Stock Reconciliation Item", "custom_clr", function(frm, cdt, cdn) {
    
    var d = locals[cdt][cdn];

        
    var a = (d.custom_clr / 4 + 0.2 * d.custom_fat + d.custom_snf).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_snf", a);
    var b = (d.qty * a / 100).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_snf_kg", b);

    var c = (d.qty * d.custom_fat / 100).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_fat_kg", c);
})