// Copyright (c) 2024, rutika rathod and contributors
// For license information, please see license.txt

frappe.ui.form.on("Gate Entry", {
	refresh(frm) {
		if (cur_frm.doc.entry_type == "Inward") {
			
			frm.set_query("party_type", function() {
				return {
					filters: {
						'name': ["in", ["Supplier"]]
					}
				};
			});
			
		} else if (cur_frm.doc.entry_type == "Outward") {
			frm.set_query("party_type", function() {
				return {
					filters: {
						'name': ["in", ["Customer"]]
					}
				};
			});
		}
		if(frm.doc.inspection_required){
			if (cur_frm.doc.docstatus == 1 && cur_frm.doc.entry_type == "Inward") {
				cur_frm.add_custom_button(
					__("Quality Inspection"),
					function() {
						// Code to create or open a Quality Inspection
						frm.doc.stock_item_tab.forEach((row) => {
							
						
						frappe.new_doc("Quality Inspection", {
							reference_type: cur_frm.doctype,
							reference_name: cur_frm.docname,
							inspection_type : "Incoming",
							item_code : row.item_code
						});
					});
					},
					__("Create")
				);
			}
		}

		
	},
	entry_type(frm) {
		if (cur_frm.doc.entry_type == "Inward") {
			frm.doc.stock_item_tab.forEach((row) => {
				frappe.model.set_value(row.doctype, row.name, "inspection_type", "Incoming");
			});
			frm.set_query("party_type", function() {
				return {
					filters: {
						'name': ["in", ["Supplier"]]
					}
				};
			});
		} else if (cur_frm.doc.entry_type == "Outward") {
			frm.set_query("party_type", function() {
				return {
					filters: {
						'name': ["in", ["Customer"]]
					}
				};
			});
		}
		
	},
    weight_out: function(frm) {
        let gross_weight = frm.doc.weight_in;
        let tare_weight = frm.doc.weight_out;
        frm.doc.net_weight = gross_weight - tare_weight;
        if (cur_frm.doc.purpose === "Raw Milk Material"){
        // Update each row in the child table
        frm.doc.stock_item_tab.forEach((row) => {
            frappe.model.set_value(row.doctype, row.name, "qty", frm.doc.net_weight);
        });
	}
        // Refresh fields to display updated values
        frm.refresh_field('net_weight');
        frm.refresh_field('items');
    },
	after_save:function(frm){
		if (cur_frm.doc.entry_type == "Inward") {
			frm.doc.stock_item_tab.forEach((row) => {
				frappe.model.set_value(row.doctype, row.name, "inspection_type", "Incoming");
			});
		}
	}

});

frappe.ui.form.on("Gate Entry",{
	refresh:function(frm){ 
		frm.set_query("purchase_receipt", function() {
			return {
				filters: {
					supplier: cur_frm.doc.supplier,
					custom_milk_collect_driver_through : 1
				}
			};
		});
	}
})

frappe.ui.form.on("Gate Entry",{
	purchase_receipt:function(frm){
		frappe.call({
			method: "frappe.client.get",
			args: {
				doctype: "Purchase Receipt",
				name: frm.doc.purchase_receipt
				},
				callback: function(r) {
				var len = r.message.items.length;
				for(var i=0;i<len;i++){
					var row = frm.add_child("stock_item_tab");
					row.item_code = r.message.items[i].item_code;
					row.item_name = r.message.items[i].item_name;
					row.uom = r.message.items[i].uom;
					row.qty = r.message.items[i].qty;
					row.fat = r.message.items[i].custom_fat;
					row.clr = r.message.items[i].custom_clr;
				}
				frm.refresh_field("stock_item_tab");
			}
						
		})
	}
})