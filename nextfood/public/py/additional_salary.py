import frappe
import json
from frappe.model.document import Document
from frappe.utils import cint, cstr, flt, get_link_to_form, getdate
from frappe import _, bold

@frappe.whitelist()
def make_stock_entry(doctype, docname, items, employee):
    try:
        if isinstance(items, str):
            items = json.loads(items)

        if not items:
            frappe.throw(_("No items to create a Stock Entry."))

        stock_entries = {}
        for item in items:
            if cint(item.get("is_delivered")) != 0:
                continue

            posting_date = getdate(item.get("posting_date"))
            if posting_date not in stock_entries:
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

        submitted_entries = []
        for posting_date, stock_entry in stock_entries.items():
            stock_entry.posting_date = posting_date
            stock_entry.save()
            stock_entry.submit()
            submitted_entries.append(stock_entry.name)

        frappe.db.commit()
        return submitted_entries

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error in make_stock_entry"))
        frappe.throw(_("An error occurred while creating Stock Entries: ") + cstr(e))
