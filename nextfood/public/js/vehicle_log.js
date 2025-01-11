frappe.ui.form.on("Vehicle Log", {
    odometer:function(frm){
        var milage = (frm.doc.odometer - frm.doc.last_odometer)/frm.doc.fuel_qty
        frm.set_value("custom_milage",milage)
    },
    fuel_qty:function(frm){
        var milage = (frm.doc.odometer - frm.doc.last_odometer)/frm.doc.fuel_qty
        var amount = frm.doc.price * frm.doc.fuel_qty
        frm.set_value("custom_milage",milage)
        frm.set_value("custom_amount",amount)
    },
    price:function(frm){
        var amount = frm.doc.price * frm.doc.fuel_qty
        frm.set_value("custom_amount",amount)
    }
})