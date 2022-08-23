import prisma from '@lib/prisma'
import {
    JunkRemovalJobs,
    OrderExpenses,
    Orders, order_status, payment_mode, payment_status, Prisma, UnsafeJobConsents,
} from '@prisma/client'

export default class OrderFactory {
    /**
     * Get order
     */
    static async getOrder(id: string) {
        const order = await prisma.orders.findFirst({
            where: {
                id,
            },
            include: {
                consumer: true,
                mover: true,
                payments: true,
                junkRemovalJob: true,
                orderImages: true,
                unsafeJobConsent: true,
                invoices: true,
                orderExpense: true,
                vehicle: true,
            },
        })

        return order
    }

    /**
     * Create a new order
     */
    static async createOrder(orderData: Orders) {
        const orderCreated = await prisma.orders.create({
            data: {
                ...orderData,
            },
        })

        return orderCreated
    }

    /**
     * Get movers of the order
     */
    static async getMover(id: string) {
        const orderMover = await prisma.orders.findFirst({
            where: {
                id,
            },
            select: {
                mover: true,
            },
        })

        if (orderMover.mover) {
            const mover = await prisma.movers.findFirst({
                where: {
                    moverEmail: orderMover.mover.moverEmail,
                },
                include: {
                    user: true,
                },
            })

            return mover
        }
    }

    /**
     * Get user of the order
     */
    static async getUser(id: string) {
        const user = await prisma.orders.findFirst({
            where: {
                id,
            },
            select: {
                consumer: true,
            },
        })

        return user
    }

    /**
     * Update order status
     */
    static async updateOrderStatus(order: Orders, status: order_status) {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                order_status: status,
            },
        })

        return updatedOrder
    }

    /**
     * Update Order
     */

    static async updateOrder(order: Orders) {
        const updateOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                ...order,
            },
        })

        return updateOrder
    }

    /**
     * Update order start otp
     */
    static async updateOrderStartOtp(order: Orders, otp: string) {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                order_start_otp: otp,
            },
        })

        return updatedOrder
    }

    /**
     * Update order start otp
     */
    static async updateOrderCompleteOtp(order: Orders, otp: string) {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                order_completion_otp: otp,
            },
        })

        return updatedOrder
    }

    /** *
         * Assign mover
         */
    static async assignMover(moverEmail: string, orderId: string) {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: orderId,
            },
            data: {
                moverEmail,
                order_status: order_status.QUEUED,
            },
            include: {
                consumer: true,
                mover: true,
            },
        })

        return updatedOrder
    }

    /**
        * Unassign mover
        */
    static async unassignMover(moverEmail: string, orderId: string) {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: orderId,
            },
            data: {
                moverEmail: null,
                order_status: order_status.PLACED,
            },
            include: {
                consumer: true,
                mover: true,
            },
        })

        return updatedOrder
    }

    /**
     * add images of orders
     */
    static async addImages(id: string, orderId: string, url: string) {
        const image = await prisma.orderImages.create({
            data: {
                id,
                orderId,
                url,
            },
        })

        return image
    }

    // /** *
    //      * Assign mover
    //      */
    // static async assignVehicle(vehcileId: string, orderId: string) {
    //     const updatedOrder = await prisma.orders.update({
    //         where: {
    //             id: orderId,
    //         },
    //         data: {
    //             vehicleId: vehcileId,
    //             order_status: order_status.QUEUED,
    //         },
    //         include: {
    //             consumer: true,
    //             mover: true,
    //         },
    //     })

    //     return updatedOrder
    // }

    // /**
    //     * Unassign mover
    //     */
    // static async unassignVehicle(vehcileId: string, orderId: string) {
    //     const updatedOrder = await prisma.orders.update({
    //         where: {
    //             id: orderId,
    //         },
    //         data: {
    //             vehicleId: null,
    //             order_status: order_status.PLACED,
    //         },
    //         include: {
    //             consumer: true,
    //             mover: true,
    //             vehicle: true,
    //         },
    //     })

    //     return updatedOrder
    // }

    /**
         * Update order payment status
         */
    static async updateOrderPaymentStatus(order: Orders, status: payment_status) {
        const dbOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                payment_status: status,
            },
            include: {
                payments: true,
            },
        })

        return dbOrder
    }

    /**
         * Update order payment mode
         */
    static async updatePaymentMode(order: Orders, mode: payment_mode) {
        const dbOrder = await prisma.payments.update({
            where: {
                id: order.id,
            },
            data: {
                mode,
            },
            include: {
                order: true,
            },
        })

        return dbOrder
    }

    /**
         * Update final order payment details
         */
    static async updateOrderFinalPaymentDetails(order: Orders, final_order_value, final_payment) {
        const dbOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                final_order_value,
                final_payment_amount: final_payment,
            },
            include: {
                payments: true,
            },
        })

        return dbOrder
    }

    /**
         * Update rating
         */
    static async updateRating(order: Orders, rating: string) {
        const dbOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                rating,
            },
        })

        return dbOrder
    }

    /**
         * Update review
         */
    static async updateReview(order: Orders, review: string) {
        const dbOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                review,
            },
        })

        return dbOrder
    }

    /**
         * Update Order completion time
         */
    static async updateOrderCompletiontime(order: Orders, time: Date) {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                order_completion_time: time,
            },
        })

        return updatedOrder
    }

    /**
         * Update Order completion time
         */
    static async updateOrderStarttime(order: Orders, time: Date) {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                order_start_time: time,
            },
        })

        return updatedOrder
    }

    /**
         * Update payment cleared
         */
    static async updateOrderPaymentCleared(order: Orders, cleared: boolean) {
        const dbOrder = await prisma.orders.update({
            where: {
                id: order.id,
            },
            data: {
                payment_cleared: cleared,
            },
            include: {
                payments: true,
            },
        })

        return dbOrder
    }

    /**
     * Unsafe job consent form
     */
    static async createUnsafeJobConsent(unsafeJobConsentData): Promise<UnsafeJobConsents> {
        const unsafeJobConsent = await prisma.unsafeJobConsents.create({
            data: {
                ...unsafeJobConsentData,
            },
        })

        return unsafeJobConsent
    }

    /**
     * update unsafe job form consent sign
     */
    static async updateUnsafeJobSignId(orderId: string, signatureId: string): Promise<UnsafeJobConsents> {
        const unsafeJobConsent = await prisma.unsafeJobConsents.update({
            where: {
                orderId,
            },
            data: {
                signatureId,
            },
        })

        return unsafeJobConsent
    }

    /**
     * update unsafe job form consent otp
     */
    static async updateUnsafeJobOtp(orderId: string, unsafeJobConsentOtp: number): Promise<UnsafeJobConsents> {
        const unsafeJobConsent = await prisma.unsafeJobConsents.update({
            where: {
                orderId,
            },
            data: {
                unsafeJobConsentOtp,
            },
        })

        return unsafeJobConsent
    }

    /**
     * Junk removal job creation
     */
    static async createJunkRemovalJob(junkRemovalJobData): Promise<JunkRemovalJobs> {
        const junkRemovalJob = await prisma.junkRemovalJobs.create({
            data: {
                ...junkRemovalJobData,
            },
        })

        return junkRemovalJob
    }

    /**
     * update junk removak job sign
     */
    static async updateJunkRemovalSignId(orderId: string, signatureId: string): Promise<JunkRemovalJobs> {
        const junkRemovalJob = await prisma.junkRemovalJobs.update({
            where: {
                orderId,
            },
            data: {
                signatureId,
            },
        })

        return junkRemovalJob
    }

    /**
     * update unsafe job form consent otp
     */
    static async updateJunkRemovalJobOtp(orderId: string, jobOtp: number): Promise<JunkRemovalJobs> {
        const junkRemovalJob = await prisma.junkRemovalJobs.update({
            where: {
                orderId,
            },
            data: {
                jobOtp,
            },
        })

        return junkRemovalJob
    }

    /**
     * get invoice
     */
    static async getOrderInvoice(id: string) {
        const invoice = await prisma.invoices.findFirst({
            where: {
                orderId: id,
            },
        })

        return invoice
    }

    /**
     * create invoice
     */
    static async createOrderInvoice(id: string, orderId: string, userEmail: string) {
        const invoice = await prisma.invoices.create({
            data: {
                id,
                orderId,
                userEmail,
            },
        })

        return invoice
    }

    /**
     * get order images
     */
    static async getOrderImages(id: string) {
        const orderImages = await prisma.orderImages.findMany({
            where: {
                orderId: id,
            },
        })

        return orderImages
    }

    /**
     * Update order expenses
     */
    static async updateOrderExpenses(expenses): Promise<OrderExpenses> {
        const orderExpenses = await prisma.orderExpenses.create({
            data: {
                ...expenses,
            },
        })

        return orderExpenses
    }

    /**
     * add junk removal items
     */
    static async addJunkRemovalItems(id: string, itemToAdd) {
        let junkRemovalJob = await prisma.junkRemovalJobs.findFirst({
            where: {
                orderId: id,
            },
        })

        const { junkRemovedDetails } = junkRemovalJob
        const detailsToUpdate = junkRemovedDetails as Prisma.JsonArray
        detailsToUpdate.push(itemToAdd)

        junkRemovalJob = await prisma.junkRemovalJobs.update({
            where: {
                orderId: id,
            },
            data: {
                junkRemovedDetails: detailsToUpdate,
            },
        })

        return junkRemovalJob
    }

    /**
     * add junk removal items
     */
    static async getJunkRemovalItems(id:string) {
        const junkRemovalJob = await prisma.junkRemovalJobs.findFirst({
            where: {
                orderId: id,
            },
            select: {
                junkRemovedDetails: true,
            },
        })

        return junkRemovalJob
    }

    /**
     * update junk rmeoval order expense
     */
    static async updateJunkRemovalExpense(id:string, junkRemovalExpense) {
        const orderExpenses = await prisma.orderExpenses.update({
            where: {
                orderId: id,
            },
            data: {
                junkRemoval: junkRemovalExpense,
            },
        })

        return orderExpenses
    }

    /**
     * update tollEpxense
     */
    static async updateTollExpense(id:string, tollEpxense) {
        const orderExpenses = await prisma.orderExpenses.update({
            where: {
                orderId: id,
            },
            data: {
                tollExpense: tollEpxense,
            },
        })

        return orderExpenses
    }

    /**
     * update tolls
     * @param id
     * @param {Array} tollsDetailsObject
     */
    static async updateTolls(id: string, tollsDetailsObject) {
        const order = await prisma.orders.update({
            where: {
                id,
            },
            data: {
                tolls: tollsDetailsObject,
            },
        })

        return order
    }

    /**
     * update discount applied amount
     */
    static async updateDiscountApplied(id: string, discountApplied) {
        const orderExpenses = await prisma.orderExpenses.update({
            where: {
                orderId: id,
            },
            data: {
                discountApplied,
            },
        })

        return orderExpenses
    }

    /**
     * add junk removal items
     */
    static async addOtherCharges(id: string, expenseToAdd) {
        let orderExpenses = await prisma.orderExpenses.findFirst({
            where: {
                orderId: id,
            },
        })

        const { otherCharges } = orderExpenses

        const chargesToUpdate = otherCharges as Prisma.JsonArray
        chargesToUpdate.push(expenseToAdd)

        orderExpenses = await prisma.orderExpenses.update({
            where: {
                orderId: id,
            },
            data: {
                otherCharges: chargesToUpdate,
            },
        })

        return orderExpenses
    }

    /**
         * add junk removal items
         */
    static async getOtherCharges(id:string) {
        const orderExpenses = await prisma.orderExpenses.findFirst({
            where: {
                orderId: id,
            },
        })

        return orderExpenses
    }

    /**
     * Delete Order
     */

    static async deleteOrder(order: Orders) {
        await prisma.orders.delete({
            where: {
                id: order.id,
            },
        })
    }
}
