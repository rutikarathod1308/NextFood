import frappe 
import time

def update_fatkg_snfkg(doc, method):
    for item in doc.items:
        bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.warehouse}, fields=['*'])
        ledger_details = frappe.get_all("Stock Ledger Entry", filters={'item_code': item.item_code, 'warehouse': item.warehouse, 'voucher_no': doc.name}, fields=['*'])
        time.sleep(1)
        if bin_details and ledger_details:
            # Access the first matching Bin record
            bin_detail = bin_details[0]
        
            # Set default values to 0 if fields are None and convert to float
            bin_fat_kg = float(bin_detail.get('fat_kg', 0) or 0)
            bin_snf_kg = float(bin_detail.get('snf_kg', 0) or 0)
            item_fat_kg = float(item.custom_fat_kg or 0)
            item_snf_kg = float(item.custom_snf_kg or 0)
            item_fat = float(bin_detail.get('actual_qty', 0) or 0)
            item_snf = float(bin_detail.get('actual_qty', 0) or 0)

            # Calculate the updated totals
            total_fat_kg = bin_fat_kg + item_fat_kg
            total_snf_kg = bin_snf_kg + item_snf_kg
            custom_fat_total = (total_fat_kg / item_fat) * 100
            custom_snf_total = (total_snf_kg / item_snf) * 100

            # Update the Bin record with new total values
            frappe.db.set_value("Bin", bin_detail.name, {
                'fat_kg': total_fat_kg,
                'snf_kg': total_snf_kg,
                'custom_fat': custom_fat_total,
                'custom_snf': custom_snf_total
            })

            ledger_detail = ledger_details[0]
            ledger_fat_kg = float(ledger_detail.get('custom_fat_kg', 0) or 0)
            ledger_snf_kg = float(ledger_detail.get('custom_snf_kg', 0) or 0)
            ledger_item_fat_kg = float(item.custom_fat_kg or 0)
            ledger_item_snf_kg = float(item.custom_snf_kg or 0)  
            ledger_item_fat = float(ledger_detail.get('actual_qty', 0) or 0)
            ledger_item_snf = float(ledger_detail.get('actual_qty', 0) or 0)

            total_fat_kg_ledger = ledger_item_fat_kg
            total_snf_kg_ledger = ledger_item_snf_kg
            custom_fat_total_ledger = (total_fat_kg_ledger / ledger_item_fat) * 100
            custom_snf_total_ledger = (total_snf_kg_ledger / ledger_item_snf) * 100

            frappe.db.set_value("Stock Ledger Entry", ledger_detail.name, {
                'custom_fat_kg': total_fat_kg_ledger,
                'custom_snf_kg': total_snf_kg_ledger,
                'custom_fat': custom_fat_total_ledger,
                'custom_snf': custom_snf_total_ledger
            })

    
def stock_rec_update_fatkg_snfkg(doc, method):
    for item in doc.items:
        bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.warehouse}, fields=['*'])
        ledger_details = frappe.get_all("Stock Ledger Entry", filters={'item_code': item.item_code, 'warehouse': item.warehouse, 'voucher_no': doc.name}, fields=['*'])
        
        time.sleep(1)
        if bin_details and ledger_details:
            # Access the first matching Bin record
            bin_detail = bin_details[0]
        
            # Set default values to 0 if fields are None and convert to float
            bin_fat_kg = float(bin_detail.get('fat_kg', 0) or 0)
            bin_snf_kg = float(bin_detail.get('snf_kg', 0) or 0)
            item_fat_kg = float(item.custom_fat_kg or 0)
            item_snf_kg = float(item.custom_snf_kg or 0)
            item_fat = float(bin_detail.get('actual_qty', 0) or 0)
            item_snf = float(bin_detail.get('actual_qty', 0) or 0)

            # Calculate the updated totals
            total_fat_kg =  float(item_fat_kg) or 0
            total_snf_kg =  float(item_snf_kg) or 0

            custom_fat_total = (total_fat_kg / item.qty) * 100 if item_fat else 0
            custom_snf_total = (total_snf_kg / item.qty) * 100 if item_snf else 0

            # Update the Bin record with new total values
            frappe.db.set_value("Bin", bin_detail.name, {
                'fat_kg': total_fat_kg,
                'snf_kg': total_snf_kg,
                'custom_fat': custom_fat_total,
                'custom_snf': custom_snf_total
            })

            ledger_detail = ledger_details[0]
            ledger_fat_kg = float(ledger_detail.get('custom_fat_kg', 0) or 0)
            ledger_snf_kg = float(ledger_detail.get('custom_snf_kg', 0) or 0)
            ledger_item_fat_kg = float(item.custom_fat_kg or 0)
            ledger_item_snf_kg = float(item.custom_snf_kg or 0)
            ledger_item_fat = float(ledger_detail.get('actual_qty', 0) or 0)
            ledger_item_snf = float(ledger_detail.get('actual_qty', 0) or 0)

            total_fat_kg_ledger = float(ledger_item_fat_kg) or 0
            total_snf_kg_ledger = float(ledger_item_snf_kg) or 0

            custom_fat_total_ledger = (total_fat_kg_ledger / item.qty) * 100 if ledger_item_fat else 0
            custom_snf_total_ledger = (total_snf_kg_ledger / item.qty) * 100 if ledger_item_snf else 0

            frappe.db.set_value("Stock Ledger Entry", ledger_detail.name, {
                'custom_fat_kg': total_fat_kg_ledger,
                'custom_snf_kg': total_snf_kg_ledger,
                'custom_fat': custom_fat_total_ledger,
                'custom_snf': custom_snf_total_ledger
            })

            
def after_cancel_fatkg_snfkg(doc, method):
    for item in doc.items:
        time.sleep(1)
        bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.warehouse}, fields=['*'])
        ledger_details = frappe.get_all("Stock Ledger Entry", filters={'item_code': item.item_code, 'warehouse': item.warehouse,'voucher_no':doc.name}, fields=['*'])
        
        if bin_details and ledger_details:
            # Access the first matching Bin record
            bin_detail = bin_details[0]
        
            # Set default values to 0 if fields are None and convert to float
            bin_fat_kg = float(bin_detail.get('fat_kg', 0) or 0)
            bin_snf_kg = float(bin_detail.get('snf_kg', 0) or 0)
            item_fat_kg = float(item.custom_fat_kg or 0)
            item_snf_kg = float(item.custom_snf_kg or 0)

            # Calculate the updated totals
            total_fat_kg = bin_fat_kg - item_fat_kg
            total_snf_kg = bin_snf_kg - item_snf_kg

            # Delay the update by 15 seconds (optional)
        

            # Update the Bin record with new total values
            frappe.db.set_value("Bin", bin_detail.name, {'fat_kg': total_fat_kg, 'snf_kg': total_snf_kg})
            
            ledger_detail = ledger_details[0]
            ledger_fat_kg = float(ledger_detail.get('custom_fat_kg', 0) or 0)
            ledger_snf_kg = float(ledger_detail.get('custom_snf_kg', 0) or 0)
            ledger_item_fat_kg = float(item.custom_fat_kg or 0)
            ledger_item_snf_kg = float(item.custom_snf_kg or 0)   
            
            total_fat_kg_ledger = ledger_fat_kg - ledger_item_fat_kg
            total_snf_kg_ledger = ledger_snf_kg - ledger_item_snf_kg
            
           
            frappe.db.set_value("Stock Ledger Entry", ledger_detail.name, {'custom_fat_kg': total_fat_kg_ledger, 'custom_snf_kg': total_snf_kg_ledger})
    
        
            
def after_stock_minus_fatkg_snfkg(doc, method):
    if doc.stock_entry_type == "Crates Return":
        for item in doc.items:
            if doc.custom_delivery_note:
                frappe.db.set_value(
                    "Delivery Note Item", 
                    {"name": item.custom_delivery_note_item, "parent": doc.custom_delivery_note}, 
                    {"custom_is_return": 1, "custom_return_qty": item.qty + item.custom_delivery_bal_qty}
                )
            elif doc.custom_sales_invoice:
                frappe.db.set_value(
                    "Sales Invoice Item", 
                    {"name": item.custom_delivery_note_item, "parent": doc.custom_sales_invoice}, 
                    {"custom_is_return": 1, "custom_return_qty": item.qty + item.custom_delivery_bal_qty}
                )

    for item in doc.items:
        # Handle both source and target warehouses
        if item.s_warehouse and item.t_warehouse:
            
            handle_warehouse_update(item, doc.name, item.s_warehouse, is_source=True)
            handle_warehouse_update(item, doc.name, item.t_warehouse, is_source=False)
        elif item.s_warehouse:
            # Handle source warehouse only
            handle_warehouse_update(item, doc.name, item.s_warehouse, is_source=True)
        elif item.t_warehouse:
            # Handle target warehouse only
            handle_warehouse_update(item, doc.name, item.t_warehouse, is_source=False)


def handle_warehouse_update(item, voucher_no, warehouse, is_source):
    
    # Get details from Bin and Stock Ledger Entry
    bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': warehouse}, fields=['*'])
    ledger_details = frappe.get_all(
        "Stock Ledger Entry",
        filters={'item_code': item.item_code, 'warehouse': warehouse, 'voucher_no': voucher_no},
        fields=['name', 'custom_fat_kg_change', 'custom_snf_kg_change']
    )

    if not bin_details or not ledger_details:
        return  # Skip if no matching records found

    bin_detail = bin_details[0]
    ledger_detail = ledger_details[0]

    # Extract existing values from SLE and Bin
    ledger_fat_kg = float(ledger_detail.get('custom_fat_kg_change', 0) or 0)
    ledger_snf_kg = float(ledger_detail.get('custom_snf_kg_change', 0) or 0)
    item_fat_kg = float((item.custom_fat_kg or 0) or 0)
    item_snf_kg = float((item.custom_snf_kg or 0) or 0)
    bin_fat_kg = float((bin_detail.get('fat_kg', 0) or 0) or 0)
    bin_snf_kg = float((bin_detail.get('snf_kg', 0) or 0) or 0)
    
    if is_source:
        # Subtract values for source warehouse
        updated_ledger_fat_kg = ledger_fat_kg - item_fat_kg
        updated_ledger_snf_kg = ledger_snf_kg - item_snf_kg
        
        bin_ledger_fat_kg = bin_fat_kg - item_fat_kg
        bin_ledger_snf_kg = bin_snf_kg - item_snf_kg
        # Update only if there is a change in the values
        if ledger_fat_kg != updated_ledger_fat_kg or ledger_snf_kg != updated_ledger_snf_kg:
            
            frappe.db.set_value("Stock Ledger Entry", ledger_detail.name, {
                'custom_fat_kg_change': updated_ledger_fat_kg,
                'custom_snf_kg_change': updated_ledger_snf_kg
            })
            frappe.db.set_value("Bin", bin_detail.name, {
                'fat_kg': bin_ledger_fat_kg,
                'snf_kg': bin_ledger_snf_kg
            })

    else:
        # Add values for target warehouse
        updated_ledger_fat_kg = ledger_fat_kg + item_fat_kg
        updated_ledger_snf_kg = ledger_snf_kg + item_snf_kg
       
        bin_ledger_fat_kg = float(bin_fat_kg + item_fat_kg) or 0 
        bin_ledger_snf_kg = float(bin_snf_kg + item_snf_kg) or 0
        total_fat_kg = float(bin_fat_kg + item_fat_kg) or 0
        total_snf_kg = float(bin_snf_kg + item_snf_kg) or 0
        item_fat = float(bin_detail.get('actual_qty', 0) or 0)
        item_snf = float(bin_detail.get('actual_qty', 0) or 0)
        custom_fat_total = float(total_fat_kg / item_fat) * 100
        custom_snf_total = (total_snf_kg / item_snf) * 100
        # Update only if there is a change in the values
        if ledger_fat_kg != updated_ledger_fat_kg or ledger_snf_kg != updated_ledger_snf_kg:
            frappe.db.set_value("Stock Ledger Entry", ledger_detail.name, {
                'custom_fat_kg': updated_ledger_fat_kg,
                'custom_snf_kg': updated_ledger_snf_kg,
                'custom_fat':custom_fat_total,
                'custom_snf':custom_snf_total
            })
            frappe.db.set_value("Bin", bin_detail.name, {
                'fat_kg': bin_ledger_fat_kg,
                'snf_kg': bin_ledger_snf_kg
            })

def delivery_item_cancel(doc, method):
    if doc.stock_entry_type == "Crates Return":
        for item in doc.items:
            if doc.custom_delivery_note:
                frappe.db.set_value(
                    "Delivery Note Item", 
                    {"name": item.custom_delivery_note_item, "parent": doc.custom_delivery_note}, 
                    {"custom_is_return":0,"custom_return_qty":item.qty + item.custom_delivery_bal_qty - item.qty} # Assuming you want to set this field to 1 (True)
                )
            elif doc.custom_sales_invoice:
                frappe.db.set_value(
                    "Sales Invoice Item", 
                    {"name": item.custom_delivery_note_item, "parent": doc.custom_sales_invoice}, 
                   {"custom_is_return":0,"custom_return_qty":item.qty + item.custom_delivery_bal_qty - item.qty}  # Assuming you want to set this field to 1 (True)
                )
    if doc.stock_entry_type == "Employee Purchase Item":
        for item in doc.items:
        # Update 'is_delivered' to 0 for the corresponding Employee Items row
            frappe.db.set_value(
                "Employee Items",
                {"parent": doc.custom_refrence_name, "name": item.custom_additional_reference_name},
                {"is_delivered":0,"stock_entry":""}
            )

    for item in doc.items:
        # Handle both source and target warehouses
        if item.s_warehouse and item.t_warehouse:
            handle_warehouse_delete(item, doc.name, item.s_warehouse, is_source=True)
            handle_warehouse_delete(item, doc.name, item.t_warehouse, is_source=False)
        elif item.s_warehouse:
            # Handle source warehouse only
            handle_warehouse_delete(item, doc.name, item.s_warehouse, is_source=True)
        elif item.t_warehouse:
            # Handle target warehouse only
            handle_warehouse_delete(item, doc.name, item.t_warehouse, is_source=False)


def handle_warehouse_delete(item, voucher_no, warehouse, is_source):
    
    # Get details from Bin and Stock Ledger Entry
    bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': warehouse}, fields=['*'])
    ledger_details = frappe.get_all(
        "Stock Ledger Entry",
        filters={'item_code': item.item_code, 'warehouse': warehouse, 'voucher_no': voucher_no},
        fields=['name', 'custom_fat_kg_change', 'custom_snf_kg_change']
    )

    if not bin_details or not ledger_details:
        return  # Skip if no matching records found

    bin_detail = bin_details[0]
    ledger_detail = ledger_details[0]

    # Extract existing values from SLE and Bin
    ledger_fat_kg = float(ledger_detail.get('custom_fat_kg_change', 0) or 0)
    ledger_snf_kg = float(ledger_detail.get('custom_snf_kg_change', 0) or 0)
    item_fat_kg = float(item.custom_fat_kg or 0)
    item_snf_kg = float(item.custom_snf_kg or 0)
    bin_fat_kg = float(bin_detail.get('fat_kg', 0) or 0)
    bin_snf_kg = float(bin_detail.get('snf_kg', 0) or 0)
    if is_source:
        # Subtract values for source warehouse
        updated_ledger_fat_kg = ledger_fat_kg + item_fat_kg
        updated_ledger_snf_kg = ledger_snf_kg + item_snf_kg
        
        bin_ledger_fat_kg = bin_fat_kg + item_fat_kg
        bin_ledger_snf_kg = bin_snf_kg + item_snf_kg
        # Update only if there is a change in the values
        if ledger_fat_kg != updated_ledger_fat_kg or ledger_snf_kg != updated_ledger_snf_kg:
            
            frappe.db.set_value("Stock Ledger Entry", ledger_detail.name, {
                'custom_fat_kg_change': updated_ledger_fat_kg,
                'custom_snf_kg_change': updated_ledger_snf_kg
            })
            frappe.db.set_value("Bin", bin_detail.name, {
                'fat_kg': bin_ledger_fat_kg,
                'snf_kg': bin_ledger_snf_kg
            })

    else:
        # Add values for target warehouse
        updated_ledger_fat_kg = ledger_fat_kg - item_fat_kg
        updated_ledger_snf_kg = ledger_snf_kg - item_snf_kg
       
        bin_ledger_fat_kg = bin_fat_kg - item_fat_kg
        bin_ledger_snf_kg = bin_snf_kg - item_snf_kg
        # Update only if there is a change in the values
        if ledger_fat_kg != updated_ledger_fat_kg or ledger_snf_kg != updated_ledger_snf_kg:
            frappe.db.set_value("Stock Ledger Entry", ledger_detail.name, {
                'custom_fat_kg': updated_ledger_fat_kg,
                'custom_snf_kg': updated_ledger_snf_kg
            })
            frappe.db.set_value("Bin", bin_detail.name, {
                'fat_kg': bin_ledger_fat_kg,
                'snf_kg': bin_ledger_snf_kg
            })
      
def after_stock_cancel_fatkg_snfkg(doc, method):
    for item in doc.items:
        if item.s_warehouse :
            bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.s_warehouse}, fields=['*'])
            
            
            if bin_details:
                # Access the first matching Bin record
                bin_detail = bin_details[0]
            
                # Set default values to 0 if fields are None and convert to float
                bin_fat_kg = float(bin_detail.get('fat_kg', 0) or 0)
                bin_snf_kg = float(bin_detail.get('snf_kg', 0) or 0)
                item_fat_kg = float(item.custom_fat_kg or 0)
                item_snf_kg = float(item.custom_snf_kg or 0)

                # Calculate the updated totals
                total_fat_kg = bin_fat_kg + item_fat_kg
                total_snf_kg = bin_snf_kg + item_snf_kg

                # Delay the update by 15 seconds (optional)
            

                # Update the Bin record with new total values
                frappe.db.set_value("Bin", bin_detail.name, {'fat_kg': total_fat_kg, 'snf_kg': total_snf_kg})
                
                
    
        
  

