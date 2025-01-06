import frappe 
import time


def update_fatkg_snfkg(doc, method):
    for item in doc.items:
        bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.warehouse}, fields=['*'])
        ledger_details = frappe.get_all("Stock Ledger Entry", filters={'item_code': item.item_code, 'warehouse': item.warehouse,'voucher_no':doc.name}, fields=['*'])
        time.sleep(1)
        if bin_details and ledger_details:
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
            frappe.db.set_value("Bin", bin_detail.name, {'fat_kg': total_fat_kg, 'snf_kg': total_snf_kg,"custom_fat":item.custom_fat,"custom_snf":item.custom_snf})
        
        
            ledger_detail = ledger_details[0]
            ledger_fat_kg = float(ledger_detail.get('custom_fat_kg', 0) or 0)
            ledger_snf_kg = float(ledger_detail.get('custom_snf_kg', 0) or 0)
            ledger_item_fat_kg = float(item.custom_fat_kg or 0)
            ledger_item_snf_kg = float(item.custom_snf_kg or 0)   
            
            total_fat_kg_ledger = ledger_item_fat_kg
            total_snf_kg_ledger = ledger_item_snf_kg 
            
            frappe.db.set_value("Stock Ledger Entry", ledger_detail.name, {'custom_fat_kg': total_fat_kg_ledger, 'custom_snf_kg': total_snf_kg_ledger,"custom_fat":item.custom_fat,"custom_snf":item.custom_snf})
    
       
            
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
                    {"custom_is_return":1,"custom_return_qty":item.qty + item.custom_delivery_bal_qty } # Assuming you want to set this field to 1 (True)
                )
            elif doc.custom_sales_invoice:
                frappe.db.set_value(
                "Sales Invoice Item", 
                {"name": item.custom_delivery_note_item, "parent": doc.custom_sales_invoice}, 
                {"custom_is_return":1,"custom_return_qty":item.qty + item.custom_delivery_bal_qty } # Assuming you want to set this field to 1 (True)
            )
        for item in doc.items:
            if item.s_warehouse and item.t_warehouse :
                
                s_bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.s_warehouse}, fields=['*'])
                t_bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.t_warehouse}, fields=['*'])
                s_ledger_details = frappe.get_all("Stock Ledger Entry", filters={'item_code': item.item_code, 'warehouse': item.s_warehouse,'voucher_no':doc.name}, fields=['*'])
                t_ledger_details = frappe.get_all("Stock Ledger Entry", filters={'item_code': item.item_code, 'warehouse': item.t_warehouse,'voucher_no':doc.name}, fields=['*'])
                print(s_ledger_details)
                if s_bin_details and s_ledger_details and  t_bin_details and t_ledger_details:
                    # Access the first matching Bin record
                    s_bin_detail = s_bin_details[0]
                
                    # Set default values to 0 if fields are None and convert to float
                    s_bin_fat_kg = float(s_bin_detail.get('fat_kg', 0) or 0)
                    s_bin_snf_kg = float(s_bin_detail.get('snf_kg', 0) or 0)
                    s_item_fat_kg = float(item.custom_fat_kg or 0)
                    s_item_snf_kg = float(item.custom_snf_kg or 0)

                    # Calculate the updated totals
                    s_total_fat_kg = s_bin_fat_kg - s_item_fat_kg
                    s_total_snf_kg = s_bin_snf_kg - s_item_snf_kg

                    # Delay the update by 15 seconds (optional)
                

                    # Update the Bin record with new total values
                    frappe.db.set_value("Bin", s_bin_detail.name, {'fat_kg': s_total_fat_kg, 'snf_kg': s_total_snf_kg})
                    
                    s_ledger_detail = s_ledger_details[0]
                    s_ledger_fat_kg = float(s_ledger_detail.get('custom_fat_kg', 0) or 0)
                    s_ledger_snf_kg = float(s_ledger_detail.get('custom_snf_kg', 0) or 0)
                    s_ledger_item_fat_kg = float(item.custom_fat_kg or 0)
                    s_ledger_item_snf_kg = float(item.custom_snf_kg or 0)   
                    
                    s_total_fat_kg_ledger = s_ledger_fat_kg - s_ledger_item_fat_kg
                    s_total_snf_kg_ledger = s_ledger_snf_kg - s_ledger_item_snf_kg
                    frappe.db.set_value("Stock Ledger Entry", s_ledger_detail.name, {'custom_fat_kg': s_total_fat_kg_ledger, 'custom_snf_kg': s_total_snf_kg_ledger})
                    time.sleep(1)
                    # Access the first matching Bin record
                    t_bin_detail = t_bin_details[0]
                
                    # Set default values to 0 if fields are None and convert to float
                    t_bin_fat_kg = float(t_bin_detail.get('fat_kg', 0) or 0)
                    t_bin_snf_kg = float(t_bin_detail.get('snf_kg', 0) or 0)
                    t_item_fat_kg = float(item.custom_fat_kg or 0)
                    t_item_snf_kg = float(item.custom_snf_kg or 0)

                    # Calculate the updated totals
                    t_total_fat_kg = t_bin_fat_kg + t_item_fat_kg
                    t_total_snf_kg = t_bin_snf_kg + t_item_snf_kg

                    # Delay the update by 15 seconds (optional)
                

                    # Update the Bin record with new total values
                    frappe.db.set_value("Bin", t_bin_detail.name, {'fat_kg': t_total_fat_kg, 'snf_kg': t_total_snf_kg})
                    
                    t_ledger_detail = t_ledger_details[0]
                    t_ledger_fat_kg = float(t_ledger_detail.get('custom_fat_kg', 0) or 0)
                    t_ledger_snf_kg = float(t_ledger_detail.get('custom_snf_kg', 0) or 0)
                    t_ledger_item_fat_kg = float(item.custom_fat_kg or 0)
                    t_ledger_item_snf_kg = float(item.custom_snf_kg or 0)   
                    
                    t_total_fat_kg_ledger = t_ledger_fat_kg + t_ledger_item_fat_kg
                    t_total_snf_kg_ledger = t_ledger_snf_kg + t_ledger_item_snf_kg
                    frappe.db.set_value("Stock Ledger Entry", t_ledger_detail.name, {'custom_fat_kg': t_total_fat_kg_ledger, 'custom_snf_kg': t_total_snf_kg_ledger})
            
                    
            
            

    

            
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
                
                
    
        
  

