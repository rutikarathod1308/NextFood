import frappe
from frappe.utils import cint, flt, getdate, formatdate
from frappe import _

def create_stock_entries(doc=None, method=None):
    if not doc.custom_is_employee_item:
        return

    # Group items by posting date
    grouped_items = {}
    for item in doc.custom_employee_items:
        if cint(item.is_delivered) or not item.posting_date:
            continue

        try:
            posting_date = getdate(item.posting_date)
        except Exception as e:
            frappe.log_error(message=str(e), title="Posting Date Conversion Error")
            continue

        if posting_date not in grouped_items:
            grouped_items[posting_date] = []
        grouped_items[posting_date].append(item)

    if not grouped_items:
       
        return

    stock_entry_names = []
    for posting_date, items in grouped_items.items():
        # Debug: Print posting date in dd-mm-yyyy format
        formatted_date = formatdate(posting_date, "dd-mm-yyyy")
       

        stock_entry = frappe.get_doc({
            'doctype': 'Stock Entry',
            'stock_entry_type': 'Employee Purchase Item',
            'custom_employee_name': doc.employee,
            'custom_refrence_name': doc.name,
            'set_posting_time': 1,
            'posting_date': posting_date,  # Keep as yyyy-mm-dd for database
            'items': [],
        })

        for item in items:
            stock_entry.append('items', {
                'item_code': item.item_code,
                'qty': flt(item.qty),
                's_warehouse': item.warehouse,
                'stock_uom': item.uom,
                'conversion_factor': 1,
                'custom_additional_reference_name': item.name,
            })

        stock_entry.insert()
        stock_entry.submit()
        stock_entry_names.append(stock_entry.name)

        for item in doc.custom_employee_items:
            if item.name in [i.name for i in items]:
                item.is_delivered = 1
                item.stock_entry = stock_entry.name

    # Save the parent document to reflect changes in the child table
    
           
   
