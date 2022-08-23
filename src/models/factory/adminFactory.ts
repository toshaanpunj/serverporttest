import prisma from '@lib/prisma'
import {
    user_type, Movers, Users, Company, Orders, Payments, Vehicles,
} from '@prisma/client'

export default class AdminFactory {
    /**
     * Get all movers
     */
    static async getAllMovers(): Promise<Movers[]> {
        const movers = prisma.movers.findMany({
            include: {
                user: true,
                orders: true,
            },
        })

        return movers
    }

    /**
     * Get all consumers
     */
    static async getAllConsumers(): Promise<Users[]> {
        const users = prisma.users.findMany({
            where: {
                user_type: user_type.USER,
            },
        })

        return users
    }

    /**
 * Get all consumers
 */
    static async getAllCompanies(): Promise<Company[]> {
        const companies = prisma.company.findMany({
            include: {
                movers: true,
            },
        })

        return companies
    }

    /**
     * Get all users
     */
    static async getAllUsers(): Promise<Users[]> {
        const users = prisma.users.findMany({
            include: {
                orders: true,
                mover: true,
            },
        })

        return users
    }

    /**
     * Get all orders
     */
    static async getAllOrders(): Promise<Orders[]> {
        const orders = prisma.orders.findMany({
            include: {
                mover: true,
                consumer: true,
            },
        })

        return orders
    }

    /**
     * Get all payments
     */
    static async getAllPayments(): Promise<Payments[]> {
        const payments = prisma.payments.findMany({
            include: {
                order: true,
                user: true,
            },
        })

        return payments
    }

    /**
     * Get all vehicles
     */
    static async getAllVehicles(): Promise<Vehicles[]> {
        const vehicles = prisma.vehicles.findMany({
            include: {
                movers: true,
            },
        })

        return vehicles
    }
}
