import { OrderExpenses, Orders, Users } from '@prisma/client'
// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
const niceInvoice = require('nice-invoice')

export default async function generateInvoice(order: Orders, user: Users, orderExpenses: OrderExpenses) {
    const products = []

    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const key in orderExpenses) {
        const product = {
            price: orderExpenses[key],
            description: key,
        }
        products.push(product)
    }

    const invoiceDetail = {
        shipping: {
            name: user.name,
            address: user.address,
            city: user.address,
            state: user.address,
            country: 'Australia',
            postal_code: 45454,
        },
        items: products,
        subtotal: order.final_order_value,
        total: order.final_order_value,
        order_number: order.id,
        header: {
            company_name: 'Oyo movers',
            company_logo: 'https://asset.cloudinary.com/oyo-movers/1d94480563fdaba7c81ad840207f3173',
            company_address: 'company address here',
        },
        footer: {
            text: 'This is a computer generated invoice.',
        },
        currency_symbol: '$',
        date: {
            billing_date: new Date(),
            due_date: new Date(),
        },
    }

    const invoice = await niceInvoice(invoiceDetail, 'your-invoice-name.pdf')

    return invoice
}
