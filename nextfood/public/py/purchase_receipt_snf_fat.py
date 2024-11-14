# import frappe 

# def update_fatkg_snfkg(doc, method):
#     for item in doc.items:
#         bin_details = frappe.get_all("Bin",filters={'item_code':item.item_code,'warehouse':item.warehouse})
#         print(bin_details)