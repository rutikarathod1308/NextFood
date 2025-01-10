frappe.ui.form.on("Vehicle Log", {
    odometer:function(frm){
        var milage = (frm.doc.odometer - frm.doc.last_odometer)/frm.doc.fuel_qty
        frm.set_value("custom_milage",milage)
    }
})