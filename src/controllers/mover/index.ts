import { Request, Response } from 'express'
import messages from '@constants/messages'
import factory from '@factory/index'
import retrieveUser from '@helpers/retrieveUser'
import { Orders, Vehicles } from '@prisma/client'
import CloudinaryAPI from '@api/cloudinary'
import cloudinaryConstants from '@constants/cloudinary'
import { UploadApiResponse } from 'cloudinary'

export default class MoverController {
    /**
     * create mover
     */
    static async createMover(req: Request, res: Response) {
        try {
            const moverData = req.body
            const moverCreated = await factory.mover.createMover(moverData)

            return res.status(200).json(moverCreated)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * get ordres of the mover
     */
    static async getOrders(req: Request, res: Response) {
        try {
            const { status } = req.query
            const user = await retrieveUser(req)

            let orders
            const dbOrders = await factory.mover.getOrders(user.email, null, null)

            if (status) orders = dbOrders.filter((order) => { if (order.order_status === status) return order })
            else orders = dbOrders

            return res.status(200).json(orders)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get mover
     */
    static async getMover(req: Request, res: Response) {
        try {
            const user = await retrieveUser(req)

            const mover = await factory.mover.getMover(user.email)

            if (user) return res.status(200).json(mover)

            return res.status(404).send(messages.not_found)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get company
     */
    static async getCompany(req: Request, res: Response) {
        try {
            const user = await retrieveUser(req)

            const moversCompany = await factory.mover.getCompany(user.email)

            return res.status(200).json(moversCompany)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Add vehcile
     */
    static async addVehicle(req: Request, res: Response) {
        try {
            const vehicleData: Vehicles = req.body
            const vehicle: Vehicles = await factory.vehicle.createVehicle(vehicleData)

            return res.status(200).json(vehicle)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * get vehicles of a mover
     */
    static async getVehicles(req: Request, res: Response) {
        try {
            const user = await retrieveUser(req)

            const vehicles = await factory.mover.getVehicles(user.email)

            return res.status(200).json(vehicles)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Update mover
     */
    static async updateMover(req: Request, res: Response) {
        try {
            const updatedMoverData = { ...req.body }
            const updatedMover = await factory.user.updateUser(updatedMoverData)

            return res.status(200).json(updatedMover)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * update pfps
     */
    static async updatePfp(req: Request, res: Response) {
        try {
            const user = await retrieveUser(req)

            const { image } = req.body

            let cloudResponse:UploadApiResponse
            if (user.pfp_public_id) {
                cloudResponse = await CloudinaryAPI.uploadImage(image, cloudinaryConstants.PFP_DIR)
            } else {
                cloudResponse = await CloudinaryAPI.updateImage(user, image, cloudinaryConstants.PFP_DIR)
            }

            const updatedUser = await factory.user.updatePfp(user, cloudResponse.public_id, cloudResponse.url)

            return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Claim order
     */
    static async claimOrder(req: Request, res: Response) {
        try {
            const user = await retrieveUser(req)
            const { orderId } = req.body

            const order = await factory.order.assignMover(user.email, orderId)

            return res.status(200).json(order)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Unclaim order
     */
    static async unclaimOrder(req: Request, res: Response) {
        try {
            const user = await retrieveUser(req)
            const { orderId } = req.body

            const order = await factory.order.unassignMover(user.email, orderId)

            return res.status(200).json(order)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * get earnings
     */
    static async getEarnings(req: Request, res: Response) {
        try {
            const user = await retrieveUser(req)

            const { from, to } = req.params

            let moverOrders: Orders[] = []

            moverOrders = await factory.mover.getOrders(user.email, from, to)

            let earnings: number = null

            moverOrders.map((mOrd) => {
                earnings += Number(mOrd.final_order_value)
            })

            return res.status(200).json({
                moverEmail: user.email, earnings, from, to,
            })
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }
}
