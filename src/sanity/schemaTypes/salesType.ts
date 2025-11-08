import { defineType, defineField } from 'sanity'
import {TagIcon} from '@sanity/icons'

export const salesType = defineType({
    name: "sale",
    title: "Sale",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "title",
            type: "string",
            title: "Sale Title",
        }),
        defineField({
            name: "description",
            type: "text",
            title: "Sale Description",
        }),
        defineField({
            name: "image",
            type: "image",
            title: "Sale Image",
        }),
        defineField({
            name: "discountAmount",
            type: "number",
            title: "Discount Amount",
            description: "The amount of discount to be applied to the product in percentage or fixed value",
        }),
        defineField({
            name: "couponCode",
            type: "string",
            title: "Coupon Code",
        }),
        defineField({
            name: "validFrom",
            type: "datetime",
            title: "Valid From",
        }),
        defineField({
            name: "validTo",
            type: "datetime",
            title: "Valid To",
        }),    
        defineField({
            name: "isActive",
            type: "boolean",
            title: "Is Active",
            description: "Toggle to activate/deactivate the sale",
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: "title",
            discountAmount: "discountAmount",
            couponCode: "couponCode",
            isActive: "isActive",
        },
        prepare(selection) {
            const {title, discountAmount, couponCode, isActive} = selection;
            const status = isActive ? "Active" : "Inactive";
            return {
                title, 
                subtitle: `${discountAmount}% off - code ${couponCode} - ${status}`,
            }
        }
    }
})