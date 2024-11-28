import frappe

@frappe.whitelist()
def get_gate_entry_detail(doc=None, custom_gate_entry=None):
    if custom_gate_entry:
        stock_items = frappe.db.get_all("Gate Entry Item",{'parent':custom_gate_entry},'*')
        frappe.response["stock_items"] = stock_items
        
@frappe.whitelist()
def get_purchase_entry_detail(doc=None, custom_purchase_receipt=None):
    if custom_purchase_receipt:
        stock_items = frappe.db.get_all("Purchase Receipt Item",{'parent':custom_purchase_receipt},'*')
        frappe.response["stock_items"] = stock_items
