# Copyright (c) 2024, rutika rathod and contributors
# For license information, please see license.txt

import frappe
import json
from frappe.model.document import Document
from frappe.utils import cint, cstr, flt, get_link_to_form, getdate
from frappe import _, bold
class GateEntry(Document):
	pass


@frappe.whitelist()
def make_quality_inspections(doctype, docname, items):
	if isinstance(items, str):
		items = json.loads(items)

	inspections = []
	for item in items:
		if flt(item.get("sample_size")) > flt(item.get("qty")):
			frappe.throw(
				_(
					"{item_name}'s Sample Size ({sample_size}) cannot be greater than the Accepted Quantity ({accepted_quantity})"
				).format(
					item_name=item.get("item_name"),
					sample_size=item.get("sample_size"),
					accepted_quantity=item.get("qty"),
				)
			)

		quality_inspection = frappe.get_doc(
			{
				"doctype": "Quality Inspection",
				"inspection_type": "Incoming",
				"inspected_by": frappe.session.user,
				"reference_type": doctype,
				"reference_name": docname,
				"item_code": item.get("item_code"),
				"description": item.get("description"),
				"sample_size": flt(item.get("sample_size")),
				"item_serial_no": item.get("serial_no").split("\n")[0] if item.get("serial_no") else None,
				"batch_no": item.get("batch_no"),
				"custom_gate_item_name":item.get("name"),
				"custom_fat":item.get("fat"),
				"custom_clr":item.get("clr")
			}
		).insert()
		quality_inspection.save()
		inspections.append(quality_inspection.name)

	return inspections