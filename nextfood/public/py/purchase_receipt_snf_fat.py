import frappe 
import time


def update_fatkg_snfkg(doc, method):
    for item in doc.items:
        bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.warehouse}, fields=['*'])
        ledger_details = frappe.get_all("Stock Ledger Entry", filters={'item_code': item.item_code, 'warehouse': item.warehouse,'voucher_no':doc.name}, fields=['*'])
        time.sleep(2)
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
        for item in doc.items:
            if item.s_warehouse :
                time.sleep(2)
                bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.s_warehouse}, fields=['*'])
                ledger_details = frappe.get_all("Stock Ledger Entry", filters={'item_code': item.item_code, 'warehouse': item.s_warehouse,'voucher_no':doc.name}, fields=['*'])
                print(ledger_details)
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
            
def delivery_item_update(doc, method):
    if doc.stock_entry_type == "Crates Return":
        for item in doc.items:
            frappe.db.set_value(
                "Delivery Note Item", 
                {"name": item.custom_delivery_note_item, "parent": doc.custom_delivery_note}, 
                "custom_is_return", 
                1  # Assuming you want to set this field to 1 (True)
            )
def delivery_item_cancel(doc, method):
    if doc.stock_entry_type == "Crates Return":
        for item in doc.items:
            frappe.db.set_value(
                "Delivery Note Item", 
                {"name": item.custom_delivery_note_item, "parent": doc.custom_delivery_note}, 
                "custom_is_return", 
                0  # Assuming you want to set this field to 1 (True)
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
                
                
    
        
# def after_stock_update_fatkg_snfkg(doc, method):
    
#     for item in doc.items:
#         time.sleep(2)
#         bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.t_warehouse}, fields=['*'])
#         ledger_details = frappe.get_all("Stock Ledger Entry", filters={'item_code': item.item_code, 'warehouse': item.s_warehouse,'voucher_no':doc.name}, fields=['*'])
#         if bin_details and ledger_details:
#             # Access the first matching Bin record
#             bin_detail = bin_details[0]
        
#             # Set default values to 0 if fields are None and convert to float
#             bin_fat_kg = float(bin_detail.get('fat_kg', 0) or 0)
#             bin_snf_kg = float(bin_detail.get('snf_kg', 0) or 0)
#             item_fat_kg = float(item.custom_fat_kg or 0)
#             item_snf_kg = float(item.custom_snf_kg or 0)

#             # Calculate the updated totals
#             total_fat_kg = bin_fat_kg + item_fat_kg
#             total_snf_kg = bin_snf_kg + item_snf_kg

#             # Delay the update by 15 seconds (optional)
        

#             # Update the Bin record with new total values
#             frappe.db.set_value("Bin", bin_detail.name, {'fat_kg': total_fat_kg, 'snf_kg': total_snf_kg})
            
            
#             ledger_detail = ledger_details[0]
        
#             # Set default values to 0 if fields are None and convert to float
#             ledger_fat_kg = float(ledger_detail.get('custom_fat_kg', 0) or 0)
#             ledger_snf_kg = float(ledger_detail.get('custom_snf_kg', 0) or 0)
#             ledger_item_fat_kg = float(item.custom_fat_kg or 0)
#             ledger_item_snf_kg = float(item.custom_snf_kg or 0)

#             # Calculate the updated totals
#             ledger_total_fat_kg = ledger_fat_kg + ledger_item_fat_kg
#             ledger_total_snf_kg = ledger_snf_kg + ledger_item_snf_kg

#             # Delay the update by 15 seconds (optional)
        

#             # Update the Bin record with new total values
#             frappe.db.set_value("Stock Ledger Entry", ledger_detail.name, {'custom_fat_kg': ledger_total_fat_kg, 'custom_snf_kg': ledger_total_snf_kg})
    
#         else:
#             # Display a message if no Bin record is found
#             frappe.msgprint(f"No bin found for item {item.item_code} in warehouse {item.t_warehouse}")
            

# def after_stock_material_fatkg_snfkg(doc, method):
#     if doc.stock_entry_type == "Material Transfer":
#         for item in doc.items:
#             if item.s_warehouse:
#                 bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.s_warehouse}, fields=['*'])
                
#                 if bin_details:
#                     # Access the first matching Bin record
#                     bin_detail = bin_details[0]
                
#                     # Set default values to 0 if fields are None and convert to float
#                     bin_fat_kg = float(bin_detail.get('fat_kg', 0) or 0)
#                     bin_snf_kg = float(bin_detail.get('snf_kg', 0) or 0)
#                     item_fat_kg = float(item.custom_purchase_fat_kg or 0)
#                     item_snf_kg = float(item.custom_purchase_snf_kg or 0)

#                     # Calculate the updated totals
#                     total_fat_kg = bin_fat_kg - item_fat_kg
#                     total_snf_kg = bin_snf_kg - item_snf_kg

#                     # Delay the update by 15 seconds (optional)
                

#                     # Update the Bin record with new total values
#                     frappe.db.set_value("Bin", bin_detail.name, {'fat_kg': total_fat_kg, 'snf_kg': total_snf_kg})

#             if item.t_warehouse:
#                 time.sleep(2)
#                 bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.t_warehouse}, fields=['*'])
        
#                 if bin_details:
#                 # Access the first matching Bin record
#                     bin_detail = bin_details[0]
        
#                     # Set default values to 0 if fields are None and convert to float
#                     bin_fat_kg = float(bin_detail.get('fat_kg', 0) or 0)
#                     bin_snf_kg = float(bin_detail.get('snf_kg', 0) or 0)
#                     item_fat_kg = float(item.custom_fat_kg or 0)
#                     item_snf_kg = float(item.custom_snf_kg or 0)

#                     # Calculate the updated totals
#                     total_fat_kg = bin_fat_kg + item_fat_kg
#                     total_snf_kg = bin_snf_kg + item_snf_kg

#                     # Delay the update by 15 seconds (optional)
                

#                     # Update the Bin record with new total values
#                     frappe.db.set_value("Bin", bin_detail.name, {'fat_kg': total_fat_kg, 'snf_kg': total_snf_kg})
    
#             else:
#                 # Display a message if no Bin record is found
#                 frappe.msgprint(f"No bin found for item {item.item_code} in warehouse {item.t_warehouse}")
                
                
                

