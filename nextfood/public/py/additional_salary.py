import frappe
import json
from frappe.model.document import Document
from frappe.utils import cint, cstr, flt, get_link_to_form, getdate
from frappe import _, bold

@frappe.whitelist()
def make_stock_entry(doctype, docname, items, employee):
    try:
        # Parse items if received as a JSON string
        if isinstance(items, str):
            items = json.loads(items)

        # Check if items exist
        if not items:
            frappe.throw(_("No items to create a Stock Entry."))

        stock_entries = {}
        for item in items:
            # Only process items where is_delivered is 0
            if cint(item.get("is_delivered")) != 0:
                continue

            posting_date = getdate(item.get("posting_date"))
            if posting_date not in stock_entries:
                # Create a new Stock Entry for the posting date with the first item
                stock_entry = frappe.get_doc(
                    {
                        "doctype": "Stock Entry",
                        "stock_entry_type": "Employee Purchase Item",
                        "posting_date": posting_date,
                        "custom_employee_name": employee,
                        "custom_refrence_name": docname,
                        "items": [
                            {
                                "item_code": item.get("item_code"),
                                "description": item.get("description"),
                                "qty": flt(item.get("qty")),
                                "uom": item.get("uom"),
                                "s_warehouse": item.get("warehouse"),
                                "stock_uom": item.get("uom"),
                                "conversion_factor": 1,
                                "custom_additional_reference_name": item.get("name"),
                            }
                        ],
                    }
                ).insert()
                stock_entries[posting_date] = stock_entry
            else:
                # Append additional items to the existing Stock Entry
                stock_entry = stock_entries[posting_date]
                stock_entry.append(
                    "items",
                    {
                        "item_code": item.get("item_code"),
                        "description": item.get("description"),
                        "qty": flt(item.get("qty")),
                        "uom": item.get("uom"),
                        "s_warehouse": item.get("warehouse"),
                        "stock_uom": item.get("uom"),
                        "conversion_factor": 1,
                    },
                )
                stock_entry.save()

        # Submit all created Stock Entries
        submitted_entries = []
        for stock_entry in stock_entries.values():
            stock_entry.submit()
            submitted_entries.append(stock_entry.name)

        # Commit changes and return submitted entries
        frappe.db.commit()
        return submitted_entries

    except Exception as e:
        # Log the error and throw a user-friendly message
        frappe.log_error(frappe.get_traceback(), _("Error in make_stock_entry"))
        frappe.throw(_("An error occurred while creating Stock Entries: ") + cstr(e))
