frappe.ui.form.on("Stock Entry Detail", "custom_clr", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    
    var a = (d.custom_clr / 4 + 0.2 * d.custom_fat + 0.14).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_snf", a);

    var b = (d.qty * a / 100).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_snf_kg", b);

    var c = (d.qty * d.custom_fat / 100).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_fat_kg", c);
    
    var amt = (
        (d.custom_basic_rate / 6.5 * 60 * d.custom_fat_kg) + 
        (d.custom_basic_rate / 8.5 * 40 * d.custom_snf_kg)
    ).toFixed(2);
    console.log(amt)
    frappe.model.set_value(cdt, cdn, "amount", amt);
 
    
})






