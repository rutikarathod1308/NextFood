import frappe

def update_qc_number(doc, method):
    if doc.reference_type == "Gate Entry":
        quality_inspection = doc.name if doc.docstatus == 1 else ""
        args = [
            doc.custom_fat,
            doc.custom_clr,
            doc.modified,
            doc.reference_name,
            doc.item_code,
        ]
        conditions = ""

        if doc.batch_no and doc.docstatus == 1:
            conditions += " AND t1.batch_no = %s"
            args.append(doc.batch_no)
        
        if doc.docstatus == 2:  # If canceled, remove QC link where the same name exists
            conditions += " AND t1.quality_inspection = %s"
            args.append(doc.name)

        args.append(doc.custom_gate_item_name)

        frappe.db.sql(
            """
            UPDATE
                `tabGate Entry Item` t1
            INNER JOIN
                `tabGate Entry` t2
            ON
                t1.parent = t2.name
            SET
                t1.fat = %s,
                t1.clr = %s,
                t2.modified = %s
            WHERE
                t1.parent = %s
                AND t1.item_code = %s
                AND t1.name = %s
                {conditions}
            """.format(conditions=conditions),
            args,
        )

    if doc.reference_type == "Purchase Receipt":
        if doc.custom_clr and doc.custom_fat:
            # Fetch the custom_snf value from the Item doctype
            snf = frappe.db.get_value("Item", doc.item_code, "custom_snf") or 0
            
            # Calculate the value of 'a'
            a = round((doc.custom_clr / 4 + 0.2 * doc.custom_fat + snf), 2)
            b =round( (doc.sample_size * a / 100),2)
            c = round((doc.sample_size * doc.custom_fat / 100),2)
            # Update the Purchase Receipt Item child table
            frappe.db.set_value(
                "Purchase Receipt Item",
                {"parent": doc.reference_name, "item_code": doc.item_code},
                {
                    "custom_fat": doc.custom_fat,
                    "custom_clr": doc.custom_clr,
                    "custom_snf": a,
                    "custom_fat_kg":c,
                    "custom_snf_kg":b
                }
            )

@frappe.whitelist()
def get_gate_entry_items(reference_name):
    return frappe.get_all("Gate Entry Item", filters={"parent": reference_name}, fields=["*"])