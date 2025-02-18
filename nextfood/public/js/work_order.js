frappe.ui.form.on("Work Order Item", "source_warehouse", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Bin",
            filters: {
                "item_code": d.item_code,
                "warehouse": d.source_warehouse
            }
        },
        callback: function(r) {
            if (r.message) {
                console.log("Bin Data: ", r.message);

                // Set values for custom fields in the child table
                frappe.model.set_value(cdt, cdn, "custom_fat", r.message.custom_fat || 0);
                frappe.model.set_value(cdt, cdn, "custom_snf", r.message.custom_snf || 0);
               
            } else {
                frappe.msgprint(__('No Bin record found for the selected item and warehouse.'));
            }
        }
    });
});


frappe.ui.form.on("Work Order Item", "custom_milk_fat", function(frm, cdt, cdn) {
    var item = locals[cdt][cdn];
    var custom_milk_items = [];
    if(item.custom_cream_calculation){
        $.each(frm.doc.required_items || [], function(i, d) {
            if (d.custom_is_milk_item) {
                // Push an object with item_code and bal_qty into the array
                custom_milk_items.push({
                    item_code: d.item_code,
                    bal_qty: frm.doc.qty,
                    milk_qty : d.required_qty,
                    milk_fat : d.custom_fat,
                });
            }
        });
        var cream_full_qty = custom_milk_items[0].bal_qty * item.custom_milk_fat / 100;
        var cream_fuly_qty = custom_milk_items[0].milk_qty * custom_milk_items[0].milk_fat / 100;
        console.log(custom_milk_items[0].milk_qty * item.custom_milk_fat/ 100)
        var final_cream_qty = cream_full_qty - cream_fuly_qty;
        // Optional: Do something with the collected data
        var cream_qty_per = final_cream_qty / item.custom_creat_percantange * 100
        var per_bom_qty = cream_qty_per/frm.doc.qty
        frappe.model.set_value(cdt, cdn, "required_qty", cream_qty_per || 0);
        frappe.model.set_value(cdt, cdn, "custom_per_bom_qty", per_bom_qty || 0);
        
    }
    // Loop through all items in the parent document's child table
    
});

frappe.ui.form.on("Work Order Item", "custom_milk_snf", function(frm, cdt, cdn) {
    var item = locals[cdt][cdn];
    var custom_milk_items = [];
    if(item.custom_smp_calculation){
    // Loop through all items in the parent document's child table
    $.each(frm.doc.required_items || [], function(i, d) {
        if (d.custom_is_milk_item) {
            // Push an object with item_code and bal_qty into the array
            custom_milk_items.push({
                item_code: d.item_code,
                bal_qty: frm.doc.qty,
                milk_qty : d.required_qty,
                milk_snf : d.custom_snf,
            });
        }
    });
    var smp_full_qty = custom_milk_items[0].bal_qty * item.custom_milk_snf / 100;
    var smp_fuly_qty = custom_milk_items[0].milk_qty * custom_milk_items[0].milk_snf / 100;
    var final_smp_qty = smp_full_qty - smp_fuly_qty;
    // Optional: Do something with the collected data
    console.log(smp_full_qty);
    console.log( smp_fuly_qty);
    console.log( final_smp_qty);
    frappe.model.set_value(cdt, cdn, "required_qty", final_smp_qty || 0);
    frappe.model.set_value(cdt, cdn, "custom_per_bom_qty", final_smp_qty/frm.doc.qty || 0);
}

});
frappe.ui.form.on("Work Order Item", "custom_fat", function(frm, cdt, cdn) {
    var item = locals[cdt][cdn];
    if(item.custom_is_milk_item){
        frappe.model.set_value(cdt, cdn, "custom_per_bom_qty", item.required_qty/frm.doc.qty || 0);
    }
});
frappe.ui.form.on("Work Order Item", "custom_smp_calculation", function(frm, cdt, cdn) {
    var item = locals[cdt][cdn];

    // Prevent circular triggering
    if (item.custom_smp_calculation) {
        frappe.model.set_value(cdt, cdn, "custom_cream_calculation", 0);
        frappe.model.set_value(cdt, cdn, "custom_water_calculation", 0);
    }
});

frappe.ui.form.on("Work Order Item", "custom_cream_calculation", function(frm, cdt, cdn) {
    var item = locals[cdt][cdn];

    // Prevent circular triggering
    if (item.custom_cream_calculation) {
        frappe.model.set_value(cdt, cdn, "custom_smp_calculation", 0);
        frappe.model.set_value(cdt, cdn, "custom_water_calculation", 0);
    }
});
frappe.ui.form.on("Work Order Item", "custom_water_calculation", function(frm, cdt, cdn) {
    var item = locals[cdt][cdn];

    // Prevent circular triggering
    if (item.custom_water_calculation) {
        frappe.model.set_value(cdt, cdn, "custom_smp_calculation", 0);
        frappe.model.set_value(cdt, cdn, "custom_cream_calculation", 0);
    }
});


frappe.ui.form.on("Work Order Item", "custom_milk_fat", function(frm, cdt, cdn) {
    var item = locals[cdt][cdn];
    var custom_milk_items = [];
    if(item.custom_water_calculation){
    // Loop through all items in the parent document's child table
    $.each(frm.doc.required_items || [], function(i, d) {
        if (d.custom_is_milk_item) {
            // Push an object with item_code and bal_qty into the array
            custom_milk_items.push({
                item_code: d.item_code,
                bal_qty: frm.doc.qty,
                milk_qty : d.required_qty,
                milk_fat : d.custom_fat,
                milk_snf : d.custom_snf,
            });
        }
    });
    var cream_total_qty = frm.doc.qty - custom_milk_items[0].milk_qty
    // console.log(custom_milk_items[0].milk_qty)
    var cream_qty = cream_total_qty * custom_milk_items[0].milk_fat / 100
    console.log(cream_total_qty)
    frappe.model.set_value(cdt, cdn, "custom_cream_qty", cream_qty);

    var smp_full_qty = custom_milk_items[0].bal_qty * item.custom_milk_snf / 100;
    var smp_fuly_qty = custom_milk_items[0].milk_qty * custom_milk_items[0].milk_snf / 100;
    var final_smp_qty = smp_full_qty - smp_fuly_qty;
    var water_aq = custom_milk_items[0].milk_qty + final_smp_qty + cream_qty
    var water_qty = frm.doc.qty - water_aq;
    // console.log(water_aq)
    frappe.model.set_value(cdt, cdn, "required_qty", water_qty);
    frappe.model.set_value(cdt, cdn, "custom_per_bom_qty", water_qty/frm.doc.qty || 0);


}

});



frappe.ui.form.on("Work Order", {
    before_save: function (frm) {
       
            if(frm.doc.custom_bom_update){
        // Iterate through the required_items child table
        $.each(frm.doc.required_items || [], function (i, d) {
            // Call the server-side method to update BOM Item
            frappe.call({
                method: "nextfood.public.py.update_bom_item.update_bom_item",
                freeze: true,
                args: {
                    bom_no: frm.doc.bom_no, // BOM No from Work Order
                    item_code: d.item_code, // Item Code from Required Items
                    field_to_update: "field_name_to_update", // Field to update
                    value_to_set: d.custom_per_bom_qty // New value for the field
                },
                callback: function (response) {
                    if (response.message.success) {
                       
                    }
                },
                error: function (err) {
                    
                }
            });
        });
    }   
    }
});
