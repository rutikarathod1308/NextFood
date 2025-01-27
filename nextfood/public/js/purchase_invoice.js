frappe.ui.form.on("Purchase Invoice Item", "custom_clr", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(frm.doc.custom_fat_and_snf_based_rate || frm.doc.custom_sheet_based_rate){
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
    if(frm.doc.custom_fat_and_snf_based_rate){
    var amt = (
        (d.rate / 6.5 * 60 * d.custom_fat_kg) + 
        (d.rate / 8.5 * 40 * d.custom_snf_kg)
    ).toFixed(2);
    frappe.model.set_value(cdt, cdn, "amount", amt);
}
    
})


frappe.ui.form.on("Purchase Invoice Item", "custom_fat", function(frm, cdt, cdn) {
    
    var d = locals[cdt][cdn];
    if(frm.doc.custom_fat_and_snf_based_rate || frm.doc.custom_sheet_based_rate){
    var a = (d.custom_clr / 4 + 0.2 * d.custom_fat + 0.14).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_snf", a);

    var b = (d.qty * a / 100).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_snf_kg", b);

    var c = (d.qty * d.custom_fat / 100).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_fat_kg", c);

    frappe.call({
        method: "nextfood.public.py.milk_rate_value.get_milk_data",
        callback: function(r) {
            if (r.milk_data) { // Check if data is returned
                var len = r.milk_data.length;
    
                // Posting date for comparison
                var posting_date = new Date(frm.doc.posting_date); // Assuming frm.doc.posting_date is available
    
                for (var i = 0; i < len; i++) {
                    var from_date = new Date(r.milk_data[i].from_date);
                    var to_date = new Date(r.milk_data[i].to_date);
    
                    // Check if posting_date is within from_date and to_date
                    if (posting_date >= from_date && posting_date <= to_date && r.milk_data[i].bmcw == d.custom_bm_or_cw && r.milk_data[i].supplier_group == frm.doc.custom_supplier_group) {
                        // Convert dates to DD-MM-YYYY format
                        var formatted_from_date = formatDate(from_date);
                        var formatted_to_date = formatDate(to_date);
                       
                       
                        if (d.custom_fat === r.milk_data[i].fat) {
                            var d1 = d.custom_snf;
                            var result = Math.floor(d1 * 10); // Multiply by 10 and truncate
                            console.log(result);
                        
                            // Correct way to dynamically construct the key
                            var d2 = `rate_${result}`; // Use backticks and ${result}
                            
                            // Access the value dynamically from the object
                            var snf_value = r.milk_data[i][d2]; 
                        
                            frappe.model.set_value(cdt, cdn, "rate", snf_value)
                        }
                    }
                }
            } else {
                console.log("No data returned from the server.");
            }
        }
    });
    
}
})