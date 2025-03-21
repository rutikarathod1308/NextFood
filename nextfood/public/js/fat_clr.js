frappe.ui.form.on("Purchase Receipt Item", "custom_clr", function(frm, cdt, cdn) {
    
    var d = locals[cdt][cdn];

        
    var a = ((d.custom_fat + d.custom_clr)/4+frm.doc.custom_snf).toFixed(2);
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
                    if (posting_date >= from_date && posting_date <= to_date && r.milk_data[i].bmcw == d.custom_bm_or_cw && r.milk_data[i].supplier_group == frm.doc.custom_supplier_group
                    ) {
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



})

function formatDate(date) {
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    var year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

frappe.ui.form.on("Purchase Receipt",{
    after_save:function(frm){
        if(cur_frm.doc.custom_sheet_based_rate){

        $.each(frm.doc.items || [], function(i,d){
            
            if(d.custom_bm_or_cw){
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
                            if (posting_date >= from_date && posting_date <= to_date && r.milk_data[i].bmcw == d.custom_bm_or_cw && r.milk_data[i].supplier_group == frm.doc.custom_supplier_group ) {
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
                                
                                    frappe.model.set_value(d.doctype, d.name, "rate", snf_value);
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
    }
    }
})
frappe.ui.form.on("Purchase Receipt Item", "custom_fat", function(frm, cdt, cdn) {
    
    var d = locals[cdt][cdn];
    
   
       
                
                var a = ((d.custom_fat + d.custom_clr)/4+frm.doc.custom_snf).toFixed(2);;
    frappe.model.set_value(cdt, cdn, "custom_snf", a);
    var b = (d.qty * a / 100).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_snf_kg", b);

    var c = (d.qty * d.custom_fat / 100).toFixed(2);
    frappe.model.set_value(cdt, cdn, "custom_fat_kg", c);
           
    

 

   
    if( frm.doc.custom_sheet_based_rate){
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
                        var a = ((stock_items[i].clr + stock_items[i].fat )/4+stock_items[i].snf).toFixed(2);
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
        if (frm.is_new()) {
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Employee",
                    fields: ["name", "employee_name", "user_id"], // Specify the fields you need
                    limit_page_length: 100, // Optional: limit the number of records
                },
                callback: function (r) {
                    if (r.message) {
                        for(var i = 0 ; i < r.message.length ; i++){
                            if(r.message[i].user_id == frappe.session.user){
                                frappe.call({
                                    "method":"frappe.client.get",
                                    args:{
                                        "doctype":"Driver",
                                        filters:{
                                            "employee":r.message.name
                                        }
                                    },
                                    callback:function(res){
                                        frm.set_value("driver",res.message.name)
                                    }
                                })
                            }
                        }
                         // Logs the list of employees
                    } else {
                        frappe.msgprint("No Employees found.");
                    }
                },
            });
        }
        
       
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
frappe.ui.form.on("Purchase Receipt", {
    refresh: function (frm) {
        if (frm.doc.supplier && frm.doc.custom_milk_collect_driver_through) {
            // Fetch Supplier Details
            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "Supplier",
                    filters: {
                        name: frm.doc.supplier
                    }
                },
                callback: function (r) {
                    if (r.message && r.message.supplier_group) {
                        console.log("Supplier Group:", r.message.supplier_group);
                        frm.set_query("set_warehouse", function () {
                            return {
                                filters: {
                                    custom_supplier_group: r.message.supplier_group
                                }
                            };
                        });
                    }
                }
            });
        }  
    }
});
frappe.ui.form.on("Purchase Receipt", {
    custom_milk_collect_driver_through: function (frm) {
if (frm.doc.set_warehouse && frm.doc.custom_milk_collect_driver_through) {
    // Fetch Warehouse Details
    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Warehouse",
            filters: {
                name: frm.doc.set_warehouse
            }
        },
        callback: function (r) {
            if (r.message && r.message.custom_supplier_group) {
                console.log("Custom Supplier Group from Warehouse:", r.message.custom_supplier_group);
                frm.set_query("supplier", function () {
                    return {
                        filters: {
                            supplier_group: r.message.custom_supplier_group
                        }
                    };
                });
            }
        }
    });
}
    }
})

