import { Request, Response } from 'express'
import messages from '@constants/messages'
import factory from '@factory/index'
import {
    order_status, Users, user_type, Vehicles,
} from '@prisma/client'
import { sendNotificationToTopic } from '@services/fcm'
import CloudinaryAPI from '@api/cloudinary'
import cloudinaryConstants from '@constants/cloudinary'

export default class AdminController {
    /**
    * Get all data
    */
    static async getAllData(req: Request, res: Response) {
        try {
            const users = await factory.admin.getAllUsers()
            const movers = await factory.admin.getAllMovers()
            const customers = await factory.admin.getAllConsumers()
            const payments = await factory.admin.getAllPayments()
            const orders = await factory.admin.getAllOrders()
            const companies = await factory.admin.getAllCompanies()

            if (users.length) {
                return res.status(200).json({
                    users, movers, customers, orders, payments, companies,
                })
            }

            return res.status(404).send(messages.not_found)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Get all users
    */
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await factory.admin.getAllUsers()

            return res.status(200).json(users)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Get all orders
    */
    static async getAllOrders(req: Request, res: Response) {
        try {
            const { status } = req.body
            const dbOrders = await factory.admin.getAllOrders()
            let orders
            // eslint-disable-next-line array-callback-return
            if (status) orders = dbOrders.filter((order) => { if (order.order_status === status) return order })
            else orders = dbOrders

            return res.status(200).json(orders)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Get all movers
    */
    static async getAllMovers(req: Request, res: Response) {
        try {
            const movers = await factory.admin.getAllMovers()

            return res.status(200).json(movers)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Get all consumers
    */
    static async getAllConsumers(req: Request, res: Response) {
        try {
            const consumers = await factory.admin.getAllConsumers()

            return res.status(200).json(consumers)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Get all companies
    */
    static async getAllCompanies(req: Request, res: Response) {
        try {
            const companies = await factory.admin.getAllCompanies()

            return res.status(200).json(companies)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Get all payments
    */
    static async getAllPayments(req: Request, res: Response) {
        try {
            const payments = await factory.admin.getAllPayments()

            if (payments.length) return res.status(200).json(payments)

            return res.status(404).send(messages.not_found)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Get order by id
    */
    static async getOrder(req: Request, res: Response) {
        try {
            const { orderId } = req.params

            const order = await factory.order.getOrder(orderId)

            if (!order) return res.status(404).send(messages.not_found)

            return res.status(200).json(order)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get company
     */
    static async getCompany(req: Request, res: Response) {
        try {
            const { companyCred } = req.params

            const company = await factory.company.getCompany(companyCred)

            if (company) return res.status(200).json(company)

            return res.status(404).send(messages.not_found)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Get payment by id
    */
    static async getPayment(req: Request, res: Response) {
        try {
            const { id } = req.params

            const payment = await factory.payment.getPayment(id)

            if (!payment) return res.status(404).send(messages.not_found)

            return res.status(200).json(payment)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get user
     */
    static async getUser(req: Request, res: Response) {
        try {
            const { userCred } = req.params
            let email: string
            let phone: string
            if (userCred.split('').includes('@')) email = userCred
            else phone = userCred

            let dbUser: Users
            if (email) dbUser = await factory.user.getUserByEmail(email)
            else dbUser = await factory.user.getUserByPhone(phone)

            if (!dbUser) return res.status(404).send(messages.not_found)

            return res.status(200).json(dbUser)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get mover
     */
    static async getMover(req: Request, res: Response) {
        try {
            const { moverEmail } = req.params

            const dbMover = await factory.mover.getMover(moverEmail)

            if (!dbMover) return res.status(404).send(messages.not_found)

            return res.status(200).json(dbMover)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * create mover
     */
    static async createMover(req: Request, res: Response) {
        try {
            const moverData = req.body
            const user = await factory.user.createUser({
                name: moverData.name,
                email: moverData.email,
                password: moverData.password,
                phone: moverData.phone,
                user_type: user_type.MOVER,
                email_verification_status: true,
                phone_verification_status: true,
                address: null,
                authToken: null,
                device_token: null,
                email_verification_code: null,
                googleAuthToken: null,
                pfp_public_id: null,
                phone_verification_code: null,
                createdAt: new Date(),
                password_reset_code: null,
                updatedAt: new Date(),
                pfp_public_url: null,

            })
            const mover = await factory.mover.createMover({
                companyEmail: moverData.companyEmail,
                moverEmail: user.email,
                profitShare: moverData.profitShare,
                createdAt: new Date(),
                document_verification_status: true,
                last_cashout_date: null,
                mover_cash: null,
                mover_earnings: null,
                lastOrderCompleted: null,
                updatedAt: new Date(),
                insurance_public_id: null,
                licnese_public_id: null,
                vehicle_reg_public_id: null,

            })

            return res.status(201).json(mover)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Update order status
     */
    static async updateOrderStatus(req: Request, res: Response) {
        try {
            const { orderId } = req.params
            const { status } = req.body
            if (!status) return res.status(400).send(messages.bad_req)

            const order = await factory.order.getOrder(orderId)

            if (!order) return res.status(404).send(messages.not_found)

            const updatedOrder = await factory.order.updateOrderStatus(order, status)

            return res.status(200).json(updatedOrder)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get movers of orders
     */
    static async getAssignedMover(req: Request, res: Response) {
        try {
            const { orderId } = req.params
            const movers = await factory.order.getMover(orderId)

            return res.status(200).json(movers)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get orders stats
     */
    static async getOrdersStats(req: Request, res: Response) {
        try {
            const allOrders = await factory.admin.getAllOrders()

            const completedOrders = allOrders.filter((order) => { if (order.order_status === order_status.COMPLETED) return order })

            const bookedOrders = allOrders.filter((order) => { if (order.order_status === order_status.PLACED) return order })

            const lastMonthOrders = allOrders.filter((order) => {
                const currentDate = new Date()
                currentDate.setMonth(currentDate.getMonth() - 1)
                const monthAgoDate = currentDate
                if (order.createdAt > monthAgoDate) return order
            })

            const lastWeekOrders = allOrders.filter((order) => {
                const currentDate = new Date()
                currentDate.setDate(currentDate.getDate() - 7)
                const weekAgoDate = currentDate
                if (order.createdAt > weekAgoDate) return order
            })

            const lastYearOrders = allOrders.filter((order) => {
                const currentDate = new Date()
                currentDate.setFullYear(currentDate.getFullYear() - 365)
                const yearAgoDate = currentDate
                if (order.createdAt > yearAgoDate) return order
            })

            const lastDayOrders = allOrders.filter((order) => {
                const currentDate = new Date()
                currentDate.setDate(currentDate.getDate() - 7)
                const dayAgoDate = currentDate
                if (order.createdAt > dayAgoDate) return order
            })

            return res.status(200).json({
                totalOrders: allOrders.length, completedOrders: completedOrders.length, bookedOrders: bookedOrders.length, lastMonthOrders: lastMonthOrders.length, lastYearOrders: lastYearOrders.length, lastWeekOrders: lastWeekOrders.length, lastDayOrders: lastDayOrders.length,
            })
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get orders of movers
     */
    static async getAssignedOrdersToMover(req: Request, res: Response) {
        try {
            const { moverEmail } = req.params

            if (!moverEmail) return res.status(400).send(messages.bad_req)

            const orders = await factory.mover.getOrders(moverEmail, null, null)

            return res.status(200).json(orders)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Assign order to mover
     */
    static async assignOrderToMover(req: Request, res: Response) {
        try {
            const { moverEmail, orderId } = req.body

            if (!moverEmail || !orderId) return res.status(400).send(messages.bad_req)

            const moverAssigned = await factory.mover.assignOrder(moverEmail, orderId)

            return res.status(200).json(moverAssigned)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * unassign order to mover
     */
    static async unassignOrderFromMover(req: Request, res: Response) {
        try {
            const { moverEmail, orderId } = req.body

            if (!moverEmail || !orderId) return res.status(400).send(messages.bad_req)

            const moverAssigned = await factory.mover.unassignOrder(orderId)

            return res.status(200).json(moverAssigned)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Assign mover
     */
    static async assignMover(req: Request, res: Response) {
        try {
            const { moverEmail, orderId } = req.body
            if (!moverEmail || !orderId) return res.status(400).send(messages.bad_req)

            const moverAssigned = await factory.order.assignMover(moverEmail, orderId)

            return res.status(200).json(moverAssigned)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Unassign mover
     */
    static async unassignMover(req: Request, res: Response) {
        try {
            const { moverEmail, orderId } = req.body
            if (!moverEmail || !orderId) return res.status(400).send(messages.bad_req)

            const moverAssigned = await factory.order.unassignMover(moverEmail, orderId)

            return res.status(200).json(moverAssigned)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * approve vehicle
     */
    static async approveVehicle(req: Request, res: Response) {
        try {
            const { vehicleNumber } = req.params
            let dbVehicle: Vehicles
            dbVehicle = await factory.vehicle.getVehicle(vehicleNumber)
            if (!dbVehicle) return res.status(404).send(messages.not_found)

            dbVehicle = await factory.vehicle.approveVehicle(vehicleNumber)

            return res.status(200).json(dbVehicle)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * approve vehicle
     */
    static async disapproveVehicle(req: Request, res: Response) {
        try {
            const { vehicleNumber } = req.params
            let dbVehicle: Vehicles
            dbVehicle = await factory.vehicle.getVehicle(vehicleNumber)
            if (!dbVehicle) return res.status(404).send(messages.not_found)

            dbVehicle = await factory.vehicle.disapproveVehicle(vehicleNumber)

            return res.status(200).json(dbVehicle)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * upload mover license
     */
    static async uploadMoverLicense(req: Request, res: Response) {
        try {
            const { moverEmail, document } = req.body

            const cloudRes = await CloudinaryAPI.uploadPdf(document, cloudinaryConstants.LICENSES_DIR)
            await factory.mover.updateLicenseId(moverEmail, cloudRes.public_id)

            return res.status(200).send(messages.success)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * upload mover license
     */
    static async uploadMoverVehicleReg(req: Request, res: Response) {
        try {
            const { moverEmail, document } = req.body

            const cloudRes = await CloudinaryAPI.uploadPdf(document, cloudinaryConstants.VEHCILE_RESGISTERATION_DIR)
            await factory.mover.updateVehicleRegisterationId(moverEmail, cloudRes.public_id)

            return res.status(200).send(messages.success)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * upload mover license
     */
    static async uploadMoverInsurance(req: Request, res: Response) {
        try {
            const { moverEmail, document } = req.body

            const cloudRes = await CloudinaryAPI.uploadPdf(document, cloudinaryConstants.INSURANCE_DIR)
            await factory.mover.updateInsuranceId(moverEmail, cloudRes.public_id)

            return res.status(200).send(messages.success)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * upload mover license
     */
    static async uploadMoverDoc(req: Request, res: Response) {
        try {
            const { moverEmail, document } = req.body

            const cloudRes = await CloudinaryAPI.uploadPdf(document, cloudinaryConstants.OTHER_DOCS_DIR)

            return res.status(200).send(messages.success)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    // /**
    //  * Assign vehicle
    //  */
    // static async assignVehicle(req: Request, res: Response) {
    //     try {
    //         const { vehicleId, orderId } = req.body
    //         if (!vehicleId || !orderId) return res.status(400).send(messages.bad_req)

    //         const updatedOrder = await factory.order.assignVehicle(vehicleId, orderId)

    //         return res.status(200).json(updatedOrder)
    //     } catch (error) {
    //         return res.status(500).send(messages.serverError)
    //     }
    // }

    // /**
    //  * Unassign vehicle
    //  */
    // static async unassignVehicle(req: Request, res: Response) {
    //     try {
    //         const { vehcileId, orderId } = req.body
    //         if (!vehcileId || !orderId) return res.status(400).send(messages.bad_req)

    //         const updatedOrder = await factory.order.unassignVehicle(vehcileId, orderId)

    //         return res.status(200).json(updatedOrder)
    //     } catch (error) {
    //         return res.status(500).send(messages.serverError)
    //     }
    // }

    /**
    * Send notification
    */
    static async sendNotifiation(req: Request, res: Response) {
        try {
            const { subject, description, topic } = req.body

            if (!subject || !description || !topic) return res.status(400).send(messages.bad_req)

            const receipentsTokens: string[] = []
            if (topic === 'USERS') {
                const users = await factory.admin.getAllConsumers()
                // eslint-disable-next-line array-callback-return
                users.map((user) => { if (user.device_token) receipentsTokens.push(user.device_token) })
            } else {
                const movers = await factory.admin.getAllMovers()
                const users: Users[] = []
                await movers.map(async (mover) => {
                    const user = await factory.user.getUserByEmail(mover.moverEmail)
                    users.push(user)
                })
                users.map((u) => { if (u) receipentsTokens.push(u.device_token) })
            }

            await sendNotificationToTopic(topic, receipentsTokens)

            return res.status(200).send(messages.success)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }
}
