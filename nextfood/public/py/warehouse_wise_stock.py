# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

import frappe
from frappe import _
from frappe.utils.dashboard import cache_source

@frappe.whitelist()
@cache_source
def get(
    chart_name=None,
    chart=None,
    no_cache=None,
    filters=None,
    from_date=None,
    to_date=None,
    timespan=None,
    time_interval=None,
    heatmap_year=None,
):
    labels, stock_values, fat_kg_values, snf_kg_values,actual_qtys = [], [], [], [],[]
    filters = frappe.parse_json(filters)

    # Step 1: Filter warehouses that are not groups and match the company filter (if provided)
    warehouse_filters = [["is_group", "=", 0]]
    if filters and filters.get("company"):
        warehouse_filters.append(["company", "=", filters.get("company")])

    warehouse_names = frappe.get_list(
        "Warehouse",
        pluck="name",
        filters=warehouse_filters,
        order_by="name"
    )

    # Step 2: Get the Bin details for filtered warehouses
    bins = frappe.get_list(
        "Bin",
        fields=[
            "warehouse", 
            "sum(stock_value) as stock_value", 
            "sum(fat_kg) as fat_kg", 
            "sum(snf_kg) as snf_kg",
            "sum(actual_qty) as actual_qty"
        ],
        filters={"warehouse": ["IN", warehouse_names], "stock_value": [">", 0]},
        group_by="warehouse",
        order_by="stock_value DESC",
        limit_page_length=10,
    )

    if not bins:
        return []

    # Step 3: Process Bin data to prepare chart labels and datasets
    for bin in bins:
        labels.append(_(bin.get("warehouse")))
        stock_values.append(bin.get("stock_value"))
        fat_kg_values.append(bin.get("fat_kg"))
        snf_kg_values.append(bin.get("snf_kg"))
        actual_qtys.append(bin.get("actual_qty"))

    # Step 4: Return chart data in the expected format
    return {
        "labels": labels,
        "datasets": [
            {"name": _("Stock Value"), "values": stock_values},
            {"name": _("Fat KG"), "values": fat_kg_values},
            {"name": _("SNF KG"), "values": snf_kg_values},
            {"name": _("Qty "), "values": actual_qtys},
        ],
        "type": "bar",
    }
