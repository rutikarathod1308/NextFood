import frappe
from frappe import _ 
from frappe.utils import cint, flt, round_based_on_smallest_currency_fraction
from erpnext.controllers.taxes_and_totals import calculate_taxes_and_totals

class custom_calculate_taxes_and_totals(calculate_taxes_and_totals):
    def custom_calculate_item_values(self):
        if self.doc.doctype == 'Purchase Receipt':
            for item in self.doc.items:
                if item.custom_fat_and_snf_based_rate:
                    if item.doctype in ["Purchase Receipt Item"]:
                            print("It's Corrected Way...:)")
                            item.amount = flt((item.rate/6.5*60*item.custom_fat_kg) + (item.rate/8.5*40*item.custom_snf_kg))
                            

                            item.net_amount = item.amount

                            self._set_in_company_currency(
					        item, ["price_list_rate", "rate", "net_rate", "amount", "net_amount"]
				            )

                            item.item_tax_amount = 0.0
                            

        elif self.doc.doctype == 'Purchase Invoice':
            for item in self.doc.items:
                if item.custom_fat_and_snf_based_rate:
                    if item.doctype in ["Purchase Invoice Item"]:
                            print("It's Corrected Way...:)")
                            item.amount = flt((item.rate/6.5*60*item.custom_fat_kg) + (item.rate/8.5*40*item.custom_snf_kg))
                            

                            item.net_amount = item.amount

                            self._set_in_company_currency(
					        item, ["price_list_rate", "rate", "net_rate", "amount", "net_amount"]
				            )

                            item.item_tax_amount = 0.0

                            
                            
                            
            
        else:
            if self.doc.get("is_consolidated"):
                return

            if not self.discount_amount_applied:
                for item in self.doc.items:
                    self.doc.round_floats_in(item)

                if item.discount_percentage == 100:
                    item.rate = 0.0
                elif item.price_list_rate:
                    if not item.rate or (item.pricing_rules and item.discount_percentage > 0):
                        item.rate = flt(
							item.price_list_rate * (1.0 - (item.discount_percentage / 100.0)),
							item.precision("rate"),
						)

                        item.discount_amount = item.price_list_rate * (item.discount_percentage / 100.0)

                    elif item.discount_amount and item.pricing_rules:
                        item.rate = item.price_list_rate - item.discount_amount

                if item.doctype in [
					"Quotation Item",
					"Sales Order Item",
					"Delivery Note Item",
					"Sales Invoice Item",
					"POS Invoice Item",
					"Purchase Invoice Item",
					"Purchase Order Item",
					"Purchase Receipt Item",
				]:
                    item.rate_with_margin, item.base_rate_with_margin = self.calculate_margin(item)
                    if flt(item.rate_with_margin) > 0:
                        item.rate = flt(
							item.rate_with_margin * (1.0 - (item.discount_percentage / 100.0)),
							item.precision("rate"),
						)

                        if item.discount_amount and not item.discount_percentage:
                            item.rate = item.rate_with_margin - item.discount_amount
                        else:
                            item.discount_amount = item.rate_with_margin - item.rate

                    elif flt(item.price_list_rate) > 0:
                        item.discount_amount = item.price_list_rate - item.rate
                elif flt(item.price_list_rate) > 0 and not item.discount_amount:
                    item.discount_amount = item.price_list_rate - item.rate

                item.net_rate = item.rate

                if (
					not item.qty
					and self.doc.get("is_return")
					and self.doc.get("doctype") != "Purchase Receipt"
				):
                    item.amount = flt(-1 * item.rate, item.precision("amount"))
                elif not item.qty and self.doc.get("is_debit_note"):
                    item.amount = flt(item.rate, item.precision("amount"))
                else:
                    item.amount = flt(item.rate * item.qty, item.precision("amount"))

                item.net_amount = item.amount

                self._set_in_company_currency(
					item, ["price_list_rate", "rate", "net_rate", "amount", "net_amount"]
				)

                item.item_tax_amount = 0.0
       
        

