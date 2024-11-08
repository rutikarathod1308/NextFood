frappe.ui.form.on("Purchase Receipt Item", "custom_clr", function(frm, cdt, cdn) {
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
    frappe.model.set_value(cdt, cdn, "amount", amt);
    
    
})

frappe.ui.form.on("Purchase Receipt Item", "item_code", function(frm, cdt, cdn) {
    var item = locals[cdt][cdn];
    
    if (item.item_group == "MILK") {
        console.log("Hello");
        
        let d = new frappe.ui.Dialog({
            title: 'Enter details',
            fields: [
                {
                    label: 'Qty',
                    fieldname: 'qty',
                    fieldtype: 'Float'
                },
                {
                    label: 'Basic Rate',
                    fieldname: 'basic_rate',
                    fieldtype: 'Float'
                },
                {
                    label: 'Fat',
                    fieldname: 'fat',
                    fieldtype: 'Float'
                },
                {
                    label: 'CLR',
                    fieldname: 'clr',
                    fieldtype: 'Float'
                },
               
            ],
            size: 'small',
            primary_action_label: 'Submit',
            primary_action(values) {
                console.log(values);
                frappe.model.set_value(cdt, cdn, "qty", values.qty);
                frappe.model.set_value(cdt, cdn, "custom_fat", values.fat);
                frappe.model.set_value(cdt, cdn, "custom_basic_rate", values.basic_rate);
                frappe.model.set_value(cdt, cdn, "custom_clr", values.clr);
                
                d.hide();
            }
        });
        
        d.show();
    }
});
