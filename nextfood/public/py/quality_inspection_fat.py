import frappe 

def update_qc_number(doc, method):
    quality_inspection = doc.name if doc.docstatus == 1 else ""
    args = [doc.custom_fat,doc.custom_clr, doc.modified, doc.reference_name, doc.item_code]
    conditions = ""
    if doc.batch_no and doc.docstatus == 1:
        conditions += " and t1.batch_no = %s"
        args.append(doc.batch_no)
    if doc.docstatus == 2:  # if cancel, then remove qi link wherever same name
        conditions += " and t1.quality_inspection = %s"
        args.append(doc.name)
    
    frappe.db.sql(
        f"""
        UPDATE
            `tabGate Entry Item` t1, `tabGate Entry` t2
        SET
            t1.fat = %s,t1.clr = %s, t2.modified = %s
        WHERE
            t1.parent = %s
            and t1.item_code = %s
            and t1.parent = t2.name
            {conditions}
        """,
        args,
    )
@frappe.whitelist()
def get_gate_entry_items(reference_name):
    return frappe.get_all("Gate Entry Item", filters={"parent": reference_name}, fields=["*"])