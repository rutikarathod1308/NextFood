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


frappe.ui.form.on("Stock Entry Detail", "item_code", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if(d.s_warehouse && frm.doc.stock_entry_type != "Material Transfer"){
        frappe.call({
            method:"frappe.client.get",
            args: {
                doctype:"Bin",
                filters:{
                    item_code:d.item_code,
                    warehouse : d.s_warehouse
                },
                fields:['*']
            }
        }).then(r => {
            console.log(r)
            frappe.model.set_value(cdt, cdn, "custom_fat_kg", r.message.fat_kg);
            frappe.model.set_value(cdt, cdn, "custom_snf_kg", r.message.snf_kg);
        })
    }
    
    
})

frappe.ui.form.on("Stock Entry", {
    custom_purchase_receipt: function(frm) {
        frappe.call({
            method: "nextfood.public.py.get_gate_entry_detail.get_purchase_entry_detail",
            args: {
                doc: frm.doc.name,
                custom_purchase_receipt: frm.doc.custom_purchase_receipt
            },
            callback: function(response) {
                if (response.stock_items ) {
                    var stock_items = response.stock_items;
                    var len = stock_items.length;
                    console.log("Number of items:", len);

                    frm.clear_table("items");

                    for (var i = 0; i < len; i++) {
                       
                        var row = frm.add_child("items");
                        row.item_code = stock_items[i].item_code;
                        row.item_name = stock_items[i].item_name;
                        row.uom = stock_items[i].uom;
                        row.qty = stock_items[i].qty;
                        row.custom_purchase_fat = stock_items[i].custom_fat;
                        row.custom_purchase_clr = stock_items[i].custom_clr;
                        row.custom_purchase_snf = stock_items[i].custom_snf;
                        row.custom_purchase_snf_kg = stock_items[i].custom_snf_kg;
                        row.custom_purchase_fat_kg = stock_items[i].custom_fat_kg;
                        row.transfer_qty  = stock_items[i].received_stock_qty
                        row.conversion_factor = stock_items[i].conversion_factor     
                        row.s_warehouse = stock_items[i].warehouse

                    }

                    frm.refresh_field("items");
                } else {
                    frappe.msgprint("No stock items found.");
                }
            }
        });
    }
})



frappe.ui.form.on("Stock Entry", {
    after_save: function(frm) {
        $.each(frm.doc.items || [], function(i,d){
            if(d.reference_purchase_receipt){
                frappe.call({
                    method: "frappe.client.get",
                    args: {
                        doctype: "Purchase Receipt",
                        name: d.reference_purchase_receipt 
                        },
                        callback: function(response) {
                            var items = response.message.items
                            $.each(items, function(i, item) {
                                if(item.item_code == d.item_code){
                                    d.custom_purchase_fat = item.custom_fat;
                                    d.custom_purchase_clr = item.custom_clr;
                                    d.custom_purchase_snf = item.custom_snf;
                                    d.custom_purchase_snf_kg = item.custom_snf_kg;
                                    d.custom_purchase_fat_kg = item.custom_fat_kg;

                                }
                            })
                        }
                                
                     
                        });
            }
        })
    }
})

frappe.ui.form.on("Stock Entry",{
    stock_entry_type:function(frm){
        if(frm.is_new() && frm.doc.stock_entry_type == "Material Transfer"){
            frappe.call({
                "method":"frappe.client.get",
                args:{
                    "doctype":"Employee",
                    "filters":{
                        'user_id':frappe.session.user,
                    }
    
                },
                callback:function(r){
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
            })
        }
    }
})
frappe.ui.form.on("Stock Entry", {
    refresh: function(frm) {
        // Add a custom button under "Get Items From"
        frm.add_custom_button(__('Purchase Receipt'), function() {
            // Open MultiSelectDialog
            var d = new frappe.ui.form.MultiSelectDialog({
                doctype: "Purchase Receipt",
                target: frm,
                setters: {
                    status: "To Bill",      // Default status
                    driver: frm.doc.driver // Pre-fill driver from the current form
                },
                add_filters_group: 1,      // Allow filters group
                columns: ["name", "supplier", "posting_date"], // Columns to display in the dialog

                // Action to handle selected records
                action(selections) {
                    console.log("Selected Purchase Receipt:", selections);

                    // Hide the dialog
                    d.dialog.hide();

                    // Fetch data from selected Purchase Receipts
                    var selected_name = selections.length
                    let all_items = []; // Array to store all fetched items from all calls

// Loop through each selection and fetch data
let promises = selections.map(pr => {
    return new Promise((resolve, reject) => {
        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "Purchase Receipt",
                name: pr // Fetch a single Purchase Receipt
            },
            callback: function(response) {
                if (response.message && response.message.items) {
                    resolve(response.message.items);
                } else {
                    resolve([]); // Resolve with empty array if no items found
                }
            },
            error: reject
        });
    });
});

// Wait for all calls to complete
Promise.all(promises).then(results => {
    // Combine all fetched items into a single array
    results.forEach(items => {
        all_items = all_items.concat(items);
    });

    // Group items by item_code and custom_bm_or_cw
    let grouped_items = {};
    all_items.forEach(item => {
        let key = `${item.item_code}_${item.custom_bm_or_cw || ''}`; // Unique key for grouping
        
        if (!grouped_items[key]) {
            grouped_items[key] = {
                item_code: item.item_code,
                custom_bm_or_cw: item.custom_bm_or_cw,
                transfer_qty : item.stock_qty,
                qty: 0,
                conversion_factor:item.conversion_factor,
                s_warehouse:item.warehouse,
                custom_cane_qty : 0,
                custom_fat_kg : 0,
                custom_snf_kg : 0,
                
            };
        }

        grouped_items[key].qty += parseFloat(item.qty) || 0;
        grouped_items[key].custom_cane_qty += parseFloat(item.custom_cane_qty) || 0;
        grouped_items[key].custom_fat_kg += parseFloat(item.custom_fat_kg) || 0;
        grouped_items[key].custom_snf_kg += parseFloat(item.custom_snf_kg) || 0;
    });

    console.log("Grouped Items:", grouped_items);

    // Clear the child table before adding new items
    frm.clear_table("items");

    // Add grouped items to the child table
    Object.values(grouped_items).forEach(item => {
        frm.add_child("items", {
            item_code: item.item_code,
            custom_bm_or_cw: item.custom_bm_or_cw,
            qty: item.qty,
            transfer_qty:item.transfer_qty,
            conversion_factor:item.conversion_factor,
            s_warehouse:item.s_warehouse,
            custom_fat_kg: item.custom_fat_kg,
            custom_snf_kg: item.custom_snf_kg,
            custom_cane_qty: item.custom_cane_qty,
        });
    });

    // Refresh the child table to display rows
    frm.refresh_field("items");

    frappe.msgprint({
        title: __('Success'),
        message: __('Grouped items have been added to the child table.'),
        indicator: 'green'
    });
}).catch(error => {
    frappe.msgprint({
        title: __('Error'),
        message: __('Failed to fetch items. Please try again.'),
        indicator: 'red'
    });
    console.error("Error fetching items:", error);
});

                    
                    
                }
            });
        }, __("Get Items From")); // Group the button under "Get Items From"
    }
});



