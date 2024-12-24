import frappe

def execute(filters=None):
    # Define the columns for the report
    columns = get_columns()
    
    # Fetch data using the query
    data = get_data(filters)

    # Return the columns and data for the report
    return columns, data

def get_columns():
    """
    Defines the columns for the report.
    """
    return [
        {
            "label": "Customer Name",
            "fieldname": "customer_name",
            "fieldtype": "Data",
            "width": 200
        },
        {
            "label": "Item Code",
            "fieldname": "item_code",
            "fieldtype": "Link",
            "options": "Item",
            "width": 150
        },
        {
            "label": "Out Qty",
            "fieldname": "out_qty",
            "fieldtype": "Float",
            "width": 120
        },
        {
            "label": "IN Qty",
            "fieldname": "in_qty",
            "fieldtype": "Float",
            "width": 120
        },
        {
            "label": "Balance Qty",
            "fieldname": "balance_qty",
            "fieldtype": "Float",
            "width": 120
        }
    ]
def get_data(filters):
    """
    Fetches the data for the report using the provided filters.
    """
    # SQL query to fetch data
    query = """
        SELECT 
            dm.customer AS customer_name,
            dnt.item_code AS item_code,
            SUM(DISTINCT dnt.qty) AS out_qty,
            SUM(DISTINCT sed.qty) AS in_qty,
            (SUM(DISTINCT dnt.qty) - SUM(DISTINCT sed.qty)) AS balance_qty
        FROM 
            `tabSales Invoice` dm
        LEFT JOIN 
            `tabSales Invoice Item` dnt 
        ON 
            dm.name = dnt.parent
        LEFT JOIN 
            `tabStock Entry` se 
        ON 
            se.custom_sales_invoice = dm.name
        LEFT JOIN 
            `tabStock Entry Detail` sed 
        ON 
            se.name = sed.parent AND dnt.item_code = sed.item_code
        WHERE 
            dnt.custom_is_companny_provided_item = 1
        AND
            DATE(dm.posting_date) BETWEEN %(from_date)s AND %(to_date)s
        GROUP BY 
            dm.customer, dnt.item_code
    """
    # Execute the query using filters
    data = frappe.db.sql(query, filters, as_dict=True)

    return data


def get_filters():
    """
    Defines filters for the report.
    """
    return [
        {
            "fieldname": "from_date",
            "label": "From Date",
            "fieldtype": "Date",
            "mandatory": 1,
            "default": frappe.utils.nowdate()
        },
        {
            "fieldname": "to_date",
            "label": "To Date",
            "fieldtype": "Date",
            "mandatory": 1,
            "default": frappe.utils.nowdate()
        }
    ]
