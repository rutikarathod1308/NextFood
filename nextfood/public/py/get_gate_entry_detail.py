import frappe

@frappe.whitelist()
def get_gate_entry_detail(doc=None, custom_gate_entry=None):
    if custom_gate_entry:
        stock_items = frappe.db.get_all("Gate Entry Stock Items",{'parent':custom_gate_entry},'*')
        frappe.response["stock_items"] = stock_items