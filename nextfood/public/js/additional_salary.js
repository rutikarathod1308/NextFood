frappe.ui.form.on("Additional Salary",{
	validate: function(frm)
{
    if (frm.doc.custom_is_employee_item) {
    var a = 0;
    $.each(frm.doc.custom_employee_items, function(i, d) {

            a += d.amount;
    });
    frm.set_value("amount",a);
    frm.refresh_field("amount");
    }
}});



frappe.ui.form.on("Employee Items", {
    rate: function (frm, cdt, cdn) {
        update_amount(cdt, cdn);
    },
    qty: function (frm, cdt, cdn) {
        update_amount(cdt, cdn);
    },
});

// Utility function to calculate and update the amount
function update_amount(cdt, cdn) {
    const row = frappe.get_doc(cdt, cdn);
    const amount = (row.rate || 0) * (row.qty || 0);
    frappe.model.set_value(cdt, cdn, "amount", amount);
}
