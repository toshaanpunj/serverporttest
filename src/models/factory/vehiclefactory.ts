import prisma from '@lib/prisma'
import { Vehicles, vehicle_approval_status } from '@prisma/client'

export default class VehvileFactory {
    /**
   * Get user by email
   */
    static async getVehicle(vehicle_number: string) {
        const user = await prisma.vehicles.findFirst({
            where: {
                vehicle_number,
            },
            include: {
                movers: true,
                orders: true,
            },
        })

        return user
    }

    /**
     * Create a vehicle
     */
    static async createVehicle(vehicleData: Vehicles) {
        const vehicle = await prisma.vehicles.create({
            data: {
                ...vehicleData,
            },
        })

        return vehicle
    }

    /**
     * Deletes a user
     */
    static async deleteVehicle(vehicle_number: string) {
        await prisma.vehicles.delete({
            where: {
                vehicle_number,
            },
        })
    }

    /**
     * Update approval status
     */
    static async approveVehicle(vehicle_number: string) {
        const dbVehicle = await prisma.vehicles.update({
            where: {
                vehicle_number,
            },
            data: {
                approved: vehicle_approval_status.APPROVED,
            },
        })

        return dbVehicle
    }

    /**
     * static async disapprove vehicle
     */
    static async disapproveVehicle(vehicle_number: string) {
        const dbVehicle = await prisma.vehicles.update({
            where: {
                vehicle_number,
            },
            data: {
                approved: vehicle_approval_status.UNAPPROVED,
            },
        })

        return dbVehicle
    }
}

