frappe.ui.form.on("Supplier", {
    custom_fat_and_snf_based_rate: function(frm) {
       
        if (cur_frm.doc.custom_fat_and_snf_based_rate) {
            frm.set_value( "custom_sheet_based_rate", 0);
        }
    },
    custom_sheet_based_rate: function(frm) {
        
        if (cur_frm.doc.custom_sheet_based_rate) {
            frm.set_value( "custom_fat_and_snf_based_rate", 0);
        }
    }
});