// Copyright (c) 2024, rutika rathod and contributors
// For license information, please see license.txt

frappe.ui.form.on("Gate Entry", {
	refresh(frm) {

	},
    weight_out: function (frm) {
		var gross_weight = frm.doc.weight_in;
		var tare_weight = frm.doc.weight_out;
		console.log(gross_weight + "\n\n" + tare_weight);
		frm.doc.net_weight = gross_weight - tare_weight;
		frm.refresh_field('net_weight');
	},
});
