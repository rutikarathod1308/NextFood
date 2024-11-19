import frappe 
import time


def update_fatkg_snfkg(doc, method):
    for item in doc.items:
        bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.warehouse}, fields=['*'])
        time.sleep(2)
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
    
        else:
            # Display a message if no Bin record is found
            frappe.msgprint(f"No bin found for item {item.item_code} in warehouse {item.warehouse}")
            
def after_cancel_fatkg_snfkg(doc, method):
    for item in doc.items:
        bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.warehouse}, fields=['*'])
        
        if bin_details:
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
    
        else:
            # Display a message if no Bin record is found
            frappe.msgprint(f"No bin found for item {item.item_code} in warehouse {item.warehouse}")
            
def after_stock_minus_fatkg_snfkg(doc, method):
    if doc.stock_entry_type != "Material Transfer":
        for item in doc.items:
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
                total_fat_kg = bin_fat_kg - item_fat_kg
                total_snf_kg = bin_snf_kg - item_snf_kg

                # Delay the update by 15 seconds (optional)
            

                # Update the Bin record with new total values
                frappe.db.set_value("Bin", bin_detail.name, {'fat_kg': total_fat_kg, 'snf_kg': total_snf_kg})
        
            else:
                # Display a message if no Bin record is found
                frappe.msgprint(f"No bin found for item {item.item_code} in warehouse {item.s_warehouse}")

def after_stock_update_fatkg_snfkg(doc, method):
    
    for item in doc.items:
        time.sleep(2)
        bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.t_warehouse}, fields=['*'])
        
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
    
        else:
            # Display a message if no Bin record is found
            frappe.msgprint(f"No bin found for item {item.item_code} in warehouse {item.t_warehouse}")
            

def after_stock_material_fatkg_snfkg(doc, method):
    if doc.stock_entry_type == "Material Transfer":
        for item in doc.items:
            if item.s_warehouse:
                bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.s_warehouse}, fields=['*'])
                
                if bin_details:
                    # Access the first matching Bin record
                    bin_detail = bin_details[0]
                
                    # Set default values to 0 if fields are None and convert to float
                    bin_fat_kg = float(bin_detail.get('fat_kg', 0) or 0)
                    bin_snf_kg = float(bin_detail.get('snf_kg', 0) or 0)
                    item_fat_kg = float(item.custom_purchase_fat_kg or 0)
                    item_snf_kg = float(item.custom_purchase_snf_kg or 0)

                    # Calculate the updated totals
                    total_fat_kg = bin_fat_kg - item_fat_kg
                    total_snf_kg = bin_snf_kg - item_snf_kg

                    # Delay the update by 15 seconds (optional)
                

                    # Update the Bin record with new total values
                    frappe.db.set_value("Bin", bin_detail.name, {'fat_kg': total_fat_kg, 'snf_kg': total_snf_kg})

            if item.t_warehouse:
                time.sleep(2)
                bin_details = frappe.get_all("Bin", filters={'item_code': item.item_code, 'warehouse': item.t_warehouse}, fields=['*'])
        
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
    
            else:
                # Display a message if no Bin record is found
                frappe.msgprint(f"No bin found for item {item.item_code} in warehouse {item.t_warehouse}")
                
                
                

