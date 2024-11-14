frappe.ui.form.on("Quality Inspection", {
    reference_name:function(frm) {
        if (frm.doc.reference_type == "Gate Entry") {
            frappe.call({
                method: "nextfood.public.py.quality_inspection_fat.get_gate_entry_items",
                args: {
                    reference_name: frm.doc.reference_name
                }
            }).then(r => {
                if (r.message) {
                   
                    frm.set_value("item_code",r.message[0].item_code)
                }
            });
        }
    }
});
