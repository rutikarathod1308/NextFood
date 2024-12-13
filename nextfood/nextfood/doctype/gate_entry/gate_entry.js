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
		if (frm.doc.inspection_required ) {
			
			frm.add_custom_button(
				__("Quality Inspection"),
				function() {
					if (Array.isArray(frm.doc.stock_item_tab) && frm.doc.stock_item_tab.length > 0) {
						frappe.call({
							method: "nextfood.nextfood.doctype.gate_entry.gate_entry.make_quality_inspections",
							args: {
								doctype: frm.doc.doctype,
								docname: frm.doc.name,
								items: frm.doc.stock_item_tab,
							},
							callback: function(response) {
								if (response.message) {
									frappe.msgprint({
										title: __("Quality Inspections Created"),
										indicator: "green",
										message: __("Quality Inspections have been created for the following items: {0}", [
											response.message.join(", "),
										]),
									});
								}
							},
						});
					} else {
						frappe.msgprint({
							title: __("No Items Found"),
							indicator: "orange",
							message: __("No items are available in the Stock Item table to create Quality Inspections."),
						});
					}
				},
				__("Create")
			);
		}
		if (frm.doc.stock_entry) {
			frm.add_custom_button(
				__("Material Receipt"),
				function () {
					// Create a new Stock Entry
					frappe.new_doc("Stock Entry", {
						posting_date: frm.doc.gate_in_date,
						stock_entry_type: "Milk Acknowledgement",
						custom_gate_entry: frm.doc.name
					});
		
					// Add items to the child table after the document is loaded
					frappe.ui.form.on("Stock Entry", {
						onload_post_render: function (stock_entry) {
							if (stock_entry.doc.custom_gate_entry === frm.doc.name) {
								const child_table_data = frm.doc.stock_item_tab.map(row => ({
									item_code: row.item_code,
									item_name: row.item_name,
									qty: row.qty,
									uom: row.uom,
									s_warehouse: row.warehouse,
									custom_fat: row.fat,
									custom_clr: row.clr,
									custom_snf: (row.clr / 4 + 0.2 * row.fat + row.snf).toFixed(2),
									custom_snf_kg: (row.qty * (row.clr / 4 + 0.2 * row.fat + row.snf) / 100).toFixed(2),
									custom_fat_kg: (row.qty * row.fat / 100).toFixed(2),
									transfer_qty: row.qty,
									conversion_factor: 1
								}));
		
								// Add rows to the child table
								child_table_data.forEach(data => {
									const row = frappe.model.add_child(stock_entry.doc, "items");
									Object.assign(row, data);
								});
		
								// Remove the first empty row (if any)
								if (stock_entry.doc.items && stock_entry.doc.items.length > 0) {
									const first_row = stock_entry.doc.items[0];
									if (!first_row.item_code) {
										stock_entry.doc.items.splice(0, 1); // Remove the first empty row
									}
								}
		
								// Reset idx for all rows
								stock_entry.doc.items.forEach((row, index) => {
									row.idx = index + 1;
								});
		
								// Refresh the child table
								stock_entry.refresh_field("items");
							}
						}
					});
				},
				__("Create")
			);
		}
		

		
		
		

		
	},
	entry_type(frm) {
		if (cur_frm.doc.entry_type == "Inward") {
			frm.doc.stock_item_tab.forEach((row) => {
				console.log(row.name)
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
		else if (cur_frm.doc.entry_type == "Driver Through Milk Inward") {
			frm.set_query("stock_entry", function() {
				return {
					filters: {
						'driver': frm.doc.driver
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

frappe.ui.form.on("Gate Entry",{
	stock_entry:function(frm){
		frappe.call({
			method: "frappe.client.get",
			args: {
				doctype: "Stock Entry",
				name: frm.doc.stock_entry
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
					row.warehouse = r.message.items[i].t_warehouse;
				}
				frm.refresh_field("stock_item_tab");
			}
						
		})
	}
})