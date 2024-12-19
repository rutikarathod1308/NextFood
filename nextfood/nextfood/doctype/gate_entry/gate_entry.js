// Copyright (c) 2024, rutika rathod and contributors
// For license information, please see license.txt

frappe.ui.form.on("Gate Entry", {
	refresh(frm) {
		
		frm.add_custom_button(__('Purchase Receipt'), function() {
            // Open MultiSelectDialog
			if(frm.doc.entry_type == "Driver Through Milk Inward"){
            var d = new frappe.ui.form.MultiSelectDialog({
                doctype: "Purchase Receipt",
                target: frm,
                setters: {
                    status: "To Bill",      // Default status
                    driver: frm.doc.driver,
					custom_purpose:"Driver Though Milk Inward",
					custom_gate_in : "No"
					 // Pre-fill driver from the current form
                },
				
                 // Columns to display in the dialog

                // Action to handle selected records
                action(selections) {
                   
					var purchase_receipt_names = []; // Initialize an empty array
					for (var i = 0; i < selections.length; i++) {
						purchase_receipt_names.push(selections[i]); // Push each name into the array
					}
					var purchase_receipt_name = purchase_receipt_names.join(", "); // Join array elements with a comma and space
				
					frm.set_value("purchase_receipt_reference",purchase_receipt_name)
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
				item_name : item.item_name,
                custom_bm_or_cw: item.custom_bm_or_cw,
                transfer_qty : item.stock_qty,
				warehouse:item.warehouse,
                qty: 0,
				bm_or_cw : item.custom_bm_or_cw,
				uom:item.uom,
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

    

    // Clear the child table before adding new items
    frm.clear_table("stock_item_tab");

    // Add grouped items to the child table
    Object.values(grouped_items).forEach(item => {
        frm.add_child("stock_item_tab", {
            item_code: item.item_code,
            custom_bm_or_cw: item.custom_bm_or_cw,
            qty: item.qty,
			item_name : item.item_name,
			bm_or_cw : item.bm_or_cw,
			warehouse:item.warehouse,
            transfer_qty:item.transfer_qty,
            conversion_factor:item.conversion_factor,
            s_warehouse:item.s_warehouse,
            custom_fat_kg: item.custom_fat_kg,
            custom_snf_kg: item.custom_snf_kg,
            cane_qty: item.custom_cane_qty,
			uom:item.uom
        });
    });

    // Refresh the child table to display rows
    frm.refresh_field("stock_item_tab");

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
		}
		if(frm.doc.entry_type == "Chilling Center"){
            var d = new frappe.ui.form.MultiSelectDialog({
                doctype: "Purchase Receipt",
                target: frm,
                setters: {
                    status: "To Bill",      // Default status
                    driver: frm.doc.driver,
					custom_purpose:"Chilling Center",
					custom_gate_in : "No"
					 // Pre-fill driver from the current form
                },
				
                 // Columns to display in the dialog

                // Action to handle selected records
                action(selections) {
                   
					var purchase_receipt_names = []; // Initialize an empty array
					for (var i = 0; i < selections.length; i++) {
						purchase_receipt_names.push(selections[i]); // Push each name into the array
					}
					var purchase_receipt_name = purchase_receipt_names.join(", "); // Join array elements with a comma and space
				
					frm.set_value("purchase_receipt_reference",purchase_receipt_name)
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
				item_name : item.item_name,
                custom_bm_or_cw: item.custom_bm_or_cw,
                transfer_qty : item.stock_qty,
				warehouse:item.warehouse,
                qty: 0,
				bm_or_cw : item.custom_bm_or_cw,
				uom:item.uom,
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

    

    // Clear the child table before adding new items
    frm.clear_table("stock_item_tab");

    // Add grouped items to the child table
    Object.values(grouped_items).forEach(item => {
        frm.add_child("stock_item_tab", {
            item_code: item.item_code,
            custom_bm_or_cw: item.custom_bm_or_cw,
            qty: item.qty,
			item_name : item.item_name,
			bm_or_cw : item.bm_or_cw,
			warehouse:item.warehouse,
            transfer_qty:item.transfer_qty,
            conversion_factor:item.conversion_factor,
            s_warehouse:item.s_warehouse,
            custom_fat_kg: item.custom_fat_kg,
            custom_snf_kg: item.custom_snf_kg,
            cane_qty: item.custom_cane_qty,
			uom:item.uom
        });
    });

    // Refresh the child table to display rows
    frm.refresh_field("stock_item_tab");

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
		}
}, __("Get Items From")); 

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
									conversion_factor: 1,
									custom_bm_or_cw:row.bm_or_cw
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
		var total_qty = 0;
		var cane_qty = 0;
		
		$.each(frm.doc.stock_item_tab, function(i, d) {
            total_qty += d.qty;
			cane_qty += d.cane_qty;
    });
    frm.set_value("total_qty",total_qty);
    frm.refresh_field("total_qty");
	frm.set_value("cane_qty",cane_qty);
    frm.refresh_field("cane_qty");
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
					row.cane_qty = r.message.items[i].custom_cane_qty;
					row.bm_or_cw = r.message.items[i].custom_bm_or_cw
				}
				frm.refresh_field("stock_item_tab");
			}
						
		})
	}
})