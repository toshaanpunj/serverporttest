import { OrderExpenses, Orders, Prisma } from '@prisma/client'
import paymentData from 'src/data/paymentData'

// TODO: payment logic for a order for the final payment calculation, to be tested and approved

export default async function finalPaymentCalculation(order: Orders, orderExpenses: OrderExpenses) {
    const orderTimeSpan = order.order_completion_time.getTime() - order.order_start_time.getTime()
    const orderTimePeriodInMinutes = Math.floor(orderTimeSpan / 60000)
    const orderTimePeriodInHalfHours = orderTimePeriodInMinutes / 30

    let serviceHired

    await paymentData.filter((service) => {
        if (service.vehcileType === order.type) {
            serviceHired = service
        }
    })

    let finalOrderValue = serviceHired.baseCharges + (serviceHired.halfHourlyCharges * orderTimePeriodInHalfHours)

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const expense in orderExpenses) {
        finalOrderValue += orderExpenses[expense]
    }
    const otherCharges = orderExpenses.otherCharges as Prisma.JsonArray
    otherCharges.map((exp) => {
        const expense = exp as Prisma.JsonObject
        finalOrderValue += Number(expense.charges)
    })

    if (orderExpenses.discountApplied) {
        finalOrderValue -= orderExpenses.discountApplied
    }

    // adding gst 10%
    finalOrderValue += finalOrderValue * (10 / 100)

    return finalOrderValue
}

