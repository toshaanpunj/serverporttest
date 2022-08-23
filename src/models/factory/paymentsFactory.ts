import prisma from '@lib/prisma'
import { Payments } from '@prisma/client'

export default class PaymentsFactory {
    /**
     * Create a new payment
     */
    static async createPayment(paymentData: Payments) {
        const paymentCreated = await prisma.payments.create({
            data: {
                ...paymentData,
            },
        })

        return paymentCreated
    }

    /**
         * Get payment
         */
    static async getPayment(id: string) {
        const payment = await prisma.payments.findFirst({
            where: {
                id,
            },
            include: {
                order: true,
                user: true,
            },
        })

        return payment
    }
}
