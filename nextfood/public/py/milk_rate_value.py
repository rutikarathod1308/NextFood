import frappe

@frappe.whitelist()
def get_milk_data():
    data = frappe.db.sql("""
        SELECT 
           *
        FROM 
            `tabMILK Rate` mr
        JOIN 
            `tabMilk Rate Item` mrt 
        ON 
            mr.name = mrt.parent
    """, as_dict=True)
    
    # Print data for debugging (use cautiously in production)
    frappe.response["milk_data"] = data
