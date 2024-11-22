frappe.ui.form.on("Purchase Receipt Item", "custom_clr", function(frm, cdt, cdn) {
    
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
                    if (posting_date >= from_date && posting_date <= to_date) {
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

function formatDate(date) {
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    var year = date.getFullYear();

    return `${day}-${month}-${year}`;
}
frappe.ui.form.on("Purchase Receipt Item", "custom_fat", function(frm, cdt, cdn) {
    
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
                    if (posting_date >= from_date && posting_date <= to_date) {
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
frappe.ui.form.on("Purchase Receipt Item", "rate", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(frm.doc.custom_fat_and_snf_based_rate ){
    var amt = (
        (d.rate / 6.5 * 60 * d.custom_fat_kg) + 
        (d.rate / 8.5 * 40 * d.custom_snf_kg)
    ).toFixed(2);
    frappe.model.set_value(cdt, cdn, "amount", amt);
}
    
})



frappe.ui.form.on("Purchase Receipt", {
    custom_gate_entry: function(frm) {
        frappe.call({
            method: "nextfood.public.py.get_gate_entry_detail.get_gate_entry_detail",
            args: {
                doc: frm.doc.name,
                custom_gate_entry: frm.doc.custom_gate_entry
            },
            callback: function(response) {
                if (response.stock_items ) {
                    var stock_items = response.stock_items;
                    var len = stock_items.length;
                    console.log("Number of items:", len);

                    frm.clear_table("items");

                    for (var i = 0; i < len; i++) {
                        var a = (stock_items[i].clr / 4 + 0.2 * stock_items[i].fat + 0.14).toFixed(2);
                        var b = (stock_items[i].qty * a / 100).toFixed(2);
                        var c = (stock_items[i].qty * stock_items[i].fat / 100).toFixed(2);
                        var row = frm.add_child("items");
                        row.item_code = stock_items[i].item_code;
                        row.item_name = stock_items[i].item_name;
                        row.uom = stock_items[i].uom;
                        row.qty = stock_items[i].qty;
                        row.custom_fat = stock_items[i].fat;
                        row.custom_clr = stock_items[i].clr;
                        row.custom_snf = a;
                        row.custom_snf_kg = b;
                        row.custom_fat_kg = c;

                    }

                    frm.refresh_field("items");
                } else {
                    frappe.msgprint("No stock items found.");
                }
            }
        });
    },
    refresh:function(frm){
        frm.set_query("custom_gate_entry",function(){
            return {
            filters:{
                "docstatus" : 1,
                "entry_type":"Inward",
                "supplier":cur_frm.doc.supplier

            }
        }
        })
    },
    supplier:function(frm){
        frm.set_query("custom_gate_entry",function(){
            return {
            filters:{
                "docstatus" : 1,
                "entry_type":"Inward",
                "supplier":cur_frm.doc.supplier

            }
        }
        })
    },
    
});

// frappe.ui.form.on("Purchase Receipt Item", "custom_fat", function(frm, cdt, cdn) {
//     var item = locals[cdt][cdn];
    
//     if (item.item_group == "MILK") {
        
//         console.log("Hello");
        
//         let d = new frappe.ui.Dialog({
//             title: 'Enter details',
//             fields: [
               
               
//                 {
//                     label: 'Fat',
//                     fieldname: 'fat',
//                     fieldtype: 'Float'
//                 },
//                 {
//                     label: 'CLR',
//                     fieldname: 'clr',
//                     fieldtype: 'Float'
//                 },
               
//             ],
//             size: 'small',
//             primary_action_label: 'Submit',
//             primary_action(values) {
//                 console.log(values);
               
//                 frappe.model.set_value(cdt, cdn, "custom_fat", values.fat);
               
//                 frappe.model.set_value(cdt, cdn, "custom_clr", values.clr);
                
//                 d.hide();
//             }
//         });
        
//         d.show();
//     }
// });
