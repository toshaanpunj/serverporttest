import prisma from '@lib/prisma'
import { Movers, Orders, Vehicles } from '@prisma/client'

export default class MoverFactory {
    /**
     * Create a new mover
     */
    static async createMover(moverData: Movers): Promise<Movers> {
        const orderCreated = await prisma.movers.create({
            data: {
                ...moverData,
            },
        })

        return orderCreated
    }

    /**
         * Get mover
         */
    static async getMover(email: string): Promise<Movers> {
        const mover = await prisma.movers.findFirst({
            where: {
                moverEmail: email,
            },
            include: {
                user: true,
                orders: true,
                company: true,
                vehicles: true,
            },
        })

        return mover
    }

    /**
    * Get company of mover
    */
    static async getCompany(email: string): Promise<Movers> {
        const mover = await prisma.movers.findFirst({
            where: {
                moverEmail: email,
            },
            include: {
                company: true,
            },
        })

        return mover
    }

    /**
         * get orders assigned to a mover
         */
    static async getOrders(email: string, from?, to?): Promise<Orders[]> {
        const dbMoverOrders = await prisma.movers.findFirst({
            where: {
                moverEmail: email,
            },
            select: {
                orders: true,
            },
        })

        const moverOrders: Orders[] = []

        dbMoverOrders.orders.map(async (mOrd) => {
            const order = await prisma.orders.findFirst({
                where: {
                    id: mOrd.id,
                },
                include: {
                    consumer: true,
                    mover: true,
                    payments: true,
                },
            })
            if (from && to) {
                if (to >= order.updatedAt >= from) moverOrders.push(order)
            } else {
                moverOrders.push(order)
            }
        })

        return moverOrders
    }

    /**
         * Update Order
         */

    static async updateMover(mover: Movers) {
        const updateOrder = await prisma.movers.update({
            where: {
                moverEmail: mover.moverEmail,
            },
            data: {
                ...mover,
            },
        })

        return updateOrder
    }

    /** *
         * Assign mover
         */
    static async assignOrder(moverEmail: string, orderId: string) {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: orderId,
            },
            data: {
                moverEmail,
            },
            include: {
                consumer: true,
                mover: true,
                // vehicle: true,
            },
        })

        return updatedOrder
    }

    /**
        * Unassign mover
        */
    static async unassignOrder(orderId: string) {
        const updatedOrder = await prisma.orders.update({
            where: {
                id: orderId,
            },
            data: {
                moverEmail: null,
            },
            include: {
                consumer: true,
                mover: true,
                // vehicle: true,
            },
        })

        return updatedOrder
    }

    /**
     * Get vehicles
     */
    static async getVehicles(moverEmail: string) {
        const dbMover = await prisma.movers.findFirst({
            where: {
                moverEmail,
            },
            include: {
                vehicles: true,
            },
        })

        let vehicles: Vehicles[]

        dbMover.vehicles.map(async (v) => {
            const vehicle = await prisma.vehicles.findFirst({
                where: {
                    vehicle_number: v.vehicle_number,
                },
            })

            vehicles.push(vehicle)
        })
    }

    /**
     * update vehicle registeration id
     */
    static async updateVehicleRegisterationId(moverEmail: string, docId: string) {
        const updatedMover = await prisma.movers.update({
            where: {
                moverEmail,
            },
            data: {
                vehicle_reg_public_id: docId,
            },
        })

        return updatedMover
    }

    /**
     * update vehicle registeration id
     */
    static async updateLicenseId(moverEmail: string, docId: string) {
        const updatedMover = await prisma.movers.update({
            where: {
                moverEmail,
            },
            data: {
                licnese_public_id: docId,
            },
        })

        return updatedMover
    }

    /**
    * update vehicle registeration id
    */
    static async updateInsuranceId(moverEmail: string, docId: string) {
        const updatedMover = await prisma.movers.update({
            where: {
                moverEmail,
            },
            data: {
                insurance_public_id: docId,
            },
        })

        return updatedMover
    }

    /**
     * Delete mover
     */

    static async deleteOrder(mover: Movers) {
        await prisma.movers.delete({
            where: {
                moverEmail: mover.moverEmail,
            },
        })
    }
}
