import frappe
from frappe import _

@frappe.whitelist()
def update_bom_item(bom_no, item_code, field_to_update, value_to_set):
    """
    Updates a specific field in BOM Item based on the Work Order's BOM and Item Code.

    :param bom_no: BOM No to filter BOM Items.
    :param item_code: Item Code to identify the BOM Item.
    :param field_to_update: The field in BOM Item to be updated.
    :param value_to_set: The value to set for the specified field.
    """
    if not frappe.has_permission("BOM Item", "write"):
        frappe.throw(_("You do not have permission to modify BOM Item records."))

    # Fetch BOM Item matching BOM and Item Code
    bom_item_name = frappe.db.get_value(
        "BOM Item",
        {"parent": bom_no, "item_code": item_code},
        "name"
    )
    bom_explode_name = frappe.db.get_value(
        "BOM Explosion Item",
        {"parent": bom_no, "item_code": item_code},
        "name"
    )

    if not bom_item_name:
        frappe.throw(_("No BOM Item found for BOM No: {0} and Item Code: {1}").format(bom_no, item_code))

    # Update the specified field in BOM Item
    frappe.db.set_value("BOM Item", bom_item_name,{ "qty": value_to_set,"stock_qty":value_to_set,"qty_consumed_per_unit":value_to_set})
    frappe.db.set_value("BOM Explosion Item", bom_explode_name,{ "stock_qty":value_to_set,"qty_consumed_per_unit":value_to_set})
    return {"success": True}
