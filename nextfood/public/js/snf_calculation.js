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



