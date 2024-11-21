frappe.ui.form.on("Purchase Invoice Item", "custom_clr", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(d.custom_fat_and_snf_based_rate){
    var a = (d.custom_clr / 4 + 0.2 * d.custom_fat + 0.14).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_snf", a);

    var b = (d.qty * a / 100).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_snf_kg", b);

    var c = (d.qty * d.custom_fat / 100).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_fat_kg", c);
    
}
    
    
})
frappe.ui.form.on("Purchase Invoice Item", "rate", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(d.custom_fat_and_snf_based_rate){
    var amt = (
        (d.rate / 6.5 * 60 * d.custom_fat_kg) + 
        (d.rate / 8.5 * 40 * d.custom_snf_kg)
    ).toFixed(2);
    frappe.model.set_value(cdt, cdn, "amount", amt);
}
    
})

frappe.ui.form.on("Purchase Invoice Item", {
    custom_fat_and_snf_based_rate: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.custom_fat_and_snf_based_rate) {
            frappe.model.set_value(cdt, cdn, "custom_sheet_based_rate", 0);
        }
    },
    custom_sheet_based_rate: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.custom_sheet_based_rate) {
            frappe.model.set_value(cdt, cdn, "custom_fat_and_snf_based_rate", 0);
        }
    }
});
