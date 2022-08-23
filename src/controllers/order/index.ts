import { Request, Response } from 'express'
import messages from '@constants/messages'
import factory from '@factory/index'
import logger from '@utils/logger'
import {
    Orders, order_status, payment_mode, payment_status,
} from '@prisma/client'
import retrieveUser from '@helpers/retrieveUser'
import generateOtp from '@helpers/otp'
import ClickSend from '@services/clickSend'
import stripe from '@services/stripe'
import finalPaymentCalc from '@helpers/payment'
import { sendNotification } from '@services/fcm'
import buildNotification from '@helpers/notificationBuilder'
import notificationtypes from '@constants/notifications'
import CloudinaryAPI from '@api/cloudinary'
import cloudinaryConstants from '@constants/cloudinary'
import generateInvoice from '@utils/invoice'
import paymentData from 'src/data/paymentData'

export default class OrderController {
    /**
     * Get order
     */
    static async getOrder(req: Request, res: Response) {
        try {
            const orderId = <string>req.params.orderId
            const order = await factory.order.getOrder(orderId)

            return res.status(200).json(order)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Create a new order
     */
    static async createOrder(req: Request, res: Response) {
        try {
            const orderData: Orders = { ...req.body }
            const { images } = req.body

            const order = await factory.order.createOrder(orderData)
            if (images) {
                images.map(async (i) => {
                    const cloudRes = await CloudinaryAPI.uploadImage(i, cloudinaryConstants.ORDER_IMAGES_DIRECTORY)
                    await factory.order.addImages(cloudRes.public_id, order.id, cloudRes.secure_url)
                })
            }

            res.status(200).json(order)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get movers of the order
     */
    static async getMovers(req: Request, res: Response) {
        try {
            const orderId = <string>req.query.orderId

            const movers = await factory.order.getMover(orderId)

            return res.status(200).json(movers)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get vehicle
     */
    static async getVehicle(req: Request, res: Response) {
        try {
            const orderId = <string>req.params.orderId

            const dbOrder = await factory.order.getOrder(orderId)

            const vehicle = await factory.vehicle.getVehicle(dbOrder.vehicleId)

            return res.status(200).json(vehicle)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get order status
     */
    static async getOrderStatus(req: Request, res: Response) {
        try {
            const orderId = <string>req.query.orderId

            const dbOrder = await factory.order.getOrder(orderId)

            return res.status(200).json(dbOrder.order_status)
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
            await sendNotification(`You order status has been updated to ${updatedOrder.order_status}`, order.consumer)

            return res.status(200).json(updatedOrder)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Start the order
    */
    static async startOrder(req: Request, res: Response) {
        try {
            const orderId = <string>req.params.orderId

            const order = await factory.order.getOrder(orderId)

            const otp = generateOtp()
            await ClickSend.sendOrderStartOtp(order.consumer, `${otp}`)

            const updatedOrder = await factory.order.updateOrderStartOtp(order, `${otp}`)

            return res.status(200).json(updatedOrder)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Verify start order
    */
    static async verifyStartOrder(req: Request, res: Response) {
        try {
            const orderId = <string>req.params.orderId
            const { otp } = req.body
            if (!otp) return res.status(400).send(messages.req_payload_missing)
            const order = await factory.order.getOrder(orderId)

            await factory.order.updateOrderStatus(order, order_status.IN_PROGRESS)
            await factory.order.updateOrderStarttime(order, new Date())

            if (order.order_start_otp === otp) {
                await factory.order.updateOrderStartOtp(order, null)

                return res.status(200).send(messages.otp_verified)
            }

            return res.status(401).send(messages.invalid_otp)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * iniate junk removal job
     */
    static async junkRemovalInitiation(req: Request, res: Response) {
        try {
            const {
                name, contactNumber, signature, orderId,
            } = req.body
            const consumer = await factory.order.getUser(orderId)
            let junkRemovalJob = await factory.order.createJunkRemovalJob({ name, contactNumber, orderId })

            const cloudRes = await CloudinaryAPI.uploadImage(signature, cloudinaryConstants.JUNK_REMOVAL_SIGN_DIR)

            junkRemovalJob = await factory.order.updateJunkRemovalSignId(orderId, cloudRes.public_id)

            const otp = await generateOtp()
            await ClickSend.sendJunkRemovalOtp(consumer.consumer, otp.toString())
            junkRemovalJob = await factory.order.updateJunkRemovalJobOtp(orderId, otp)

            return res.status(200).json(junkRemovalJob)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
         * verify junk rmoval otp
         */
    static async verifyJunkRemovalOtp(req: Request, res: Response) {
        try {
            const { orderId, otp } = req.body

            const dbOrder = await factory.order.getOrder(orderId)

            if (Number(dbOrder.junkRemovalJob.jobOtp) === Number(otp)) return res.status(200).send(messages.otp_verified)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
         * iniate junk removal job
         */
    static async unsafeJobConsentInitiation(req: Request, res: Response) {
        try {
            const {
                name, contactNumber, signature, orderId,
            } = req.body
            const consumer = await factory.order.getUser(orderId)

            let unsafeJobConsent = await factory.order.createUnsafeJobConsent({ name, contactNumber, orderId })

            const cloudRes = await CloudinaryAPI.uploadImage(signature, cloudinaryConstants.UNSAFE_JOB_CONSENT_SIGN)

            unsafeJobConsent = await factory.order.updateUnsafeJobSignId(orderId, cloudRes.public_id)

            const otp = await generateOtp()
            await ClickSend.sendJunkRemovalOtp(consumer.consumer, otp.toString())
            unsafeJobConsent = await factory.order.updateUnsafeJobOtp(orderId, otp)

            return res.status(200).json(unsafeJobConsent)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
         * verify unsafe consent otp
         */
    static async verifyUnsafeJobOtp(req: Request, res: Response) {
        try {
            const { orderId, otp } = req.body

            const dbOrder = await factory.order.getOrder(orderId)

            if (Number(dbOrder.unsafeJobConsent.unsafeJobConsentOtp) === Number(otp)) return res.status(200).send(messages.otp_verified)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Complete the order
    */
    static async completeOrder(req: Request, res: Response) {
        try {
            const orderId = <string>req.params.orderId

            const order = await factory.order.getOrder(orderId)

            const otp = generateOtp()
            await ClickSend.sendOrderCompleteOtp(order.consumer, `${otp}`)
            const updatedOrder = await factory.order.updateOrderCompleteOtp(order, `${otp}`)

            return res.status(200).json(updatedOrder)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
    * Verify completion order
    */
    static async verifyCompletionOrder(req: Request, res: Response) {
        try {
            const orderId = <string>req.params.orderId
            const { otp } = req.body
            if (!otp) return res.status(400).send(messages.req_payload_missing)
            const order = await factory.order.getOrder(orderId)

            await factory.order.updateOrderCompletiontime(order, new Date())
            await factory.order.updateOrderStatus(order, order_status.COMPLETED)

            if (order.order_completion_otp === otp) {
                await factory.order.updateOrderCompleteOtp(order, null)

                return res.status(200).send(messages.otp_verified)
            }

            return res.status(401).send(messages.invalid_otp)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Update payment status
     */
    static async updatePaymentStatus(req: Request, res: Response) {
        try {
            const { orderId } = req.params
            const { paymentStatus } = req.body
            const order = await factory.order.getOrder(orderId)
            if (!order) return res.status(404).send(messages.not_found)

            const updatedOrder = await factory.order.updateOrderPaymentStatus(order, paymentStatus)

            return res.status(200).json(updatedOrder)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * update order rating and review
     */
    static async uppdateRatingReview(req: Request, res: Response) {
        try {
            const { orderId } = req.params
            const { rating, review } = req.body
            if (!orderId) return res.status(400).send(messages.bad_req)
            const order = await factory.order.getOrder(orderId)
            await factory.order.updateRating(order, rating)
            await factory.order.updateReview(order, review)

            return res.status(200).send(messages.success)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get rating and review of the order
     */
    static async getRatingReview(req: Request, res: Response) {
        try {
            const { orderId } = req.params
            if (!orderId) return res.status(400).send(messages.bad_req)
            const order = await factory.order.getOrder(orderId)
            if (!order) return res.status(400).send('Enter a vallid order id')

            return res.status(200).json({
                orderId: order.id, user: order.userEmail, rating: order.rating, review: order.review,
            })
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * get order images
     */
    static async getOrderImages(req: Request, res: Response) {
        try {
            const { orderId } = req.params
            if (!orderId) return res.status(400).send(messages.bad_req)
            const order = await factory.order.getOrder(orderId)
            if (!order) return res.status(400).send('Enter a vallid order id')

            const orderImagesDetails = await factory.order.getOrderImages(orderId)

            const orderImages = orderImagesDetails.map((im) => im.url)

            return res.status(200).json(orderImages)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * get invoices
     */
    static async getInvoice(req: Request, res: Response) {
        try {
            const { orderId } = req.params
            if (!orderId) return res.status(400).send(messages.bad_req)
            const order = await factory.order.getOrder(orderId)
            if (!order) return res.status(400).send('Enter a valid order id')
            const invoice = await factory.order.getOrderInvoice(orderId)
            const cloudRes = await CloudinaryAPI.getInvoice(invoice.id)

            return res.status(200).json({
                orderId: order.id, invoice: cloudRes.resources,
            })
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * update junk removal items
     */
    static async updateJunkRemovalItems(req: Request, res: Response) {
        try {
            const { orderId, item } = req.body
            if (!orderId) return res.status(400).send(messages.bad_req)
            const order = await factory.order.getOrder(orderId)
            if (!order) return res.status(400).send('Enter a valid order id')
            const junkRemovalJob = await factory.order.addJunkRemovalItems(orderId, item)

            return res.status(200).json(junkRemovalJob)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * update junk removal items
     */
    static async updateTolls(req: Request, res: Response) {
        try {
            const { orderId, tolls } = req.body
            if (!orderId) return res.status(400).send(messages.bad_req)
            const order = await factory.order.getOrder(orderId)
            if (!order) return res.status(400).send('Enter a valid order id')
            const updatedOrder = await factory.order.updateTolls(orderId, tolls)

            return res.status(200).json(updatedOrder)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * update junk removal items
     */
    static async updateOtherExpense(req: Request, res: Response) {
        try {
            const { orderId, expense } = req.body
            if (!orderId) return res.status(400).send(messages.bad_req)
            const order = await factory.order.getOrder(orderId)
            if (!order) return res.status(400).send('Enter a valid order id')

            const orderExpenses = await factory.order.addOtherCharges(orderId, expense)

            return res.status(200).json(orderExpenses)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Generate and verify payment
     */
    static async payment(req: Request, res: Response) {
        try {
            const { orderId } = req.params
            const { mode } = req.body
            if (!orderId) return res.status(400).send(messages.bad_req)
            const order = await factory.order.getOrder(orderId)
            if (!order) return res.status(400).send('Enter a valid order id')
            const orderExpenses = await factory.order.getOtherCharges(orderId)
            const mover = await retrieveUser(req)

            const user = await factory.user.getUserByEmail(order.userEmail)

            // calculating final order value
            const finalOrderValue = await finalPaymentCalc(order, orderExpenses)

            // generating invoice
            const generatedInvoice = await generateInvoice(order, user, orderExpenses)

            // uploading invoice pdf
            const cloudRes = await CloudinaryAPI.uploadPdf(generatedInvoice, cloudinaryConstants.INVOICE_PDFS_DIR)

            // updating invoice in the db
            await factory.order.createOrderInvoice(cloudRes.public_id, order.id, user.email)

            if (mode === payment_mode.ONLINE) {
                // selecting product from stripe
                let productId: string
                paymentData.map((service) => {
                    if (service.vehcileType === order.type) productId = service.stripeProductId
                })

                // creating price for the choosen product
                const price = await stripe.prices.create({
                    currency: 'aud',
                    unit_amount: finalOrderValue * 100,
                    product: productId,
                })

                // generating product
                const paymentLink = await stripe.paymentLinks.create({
                    line_items: [{ price: price.id, quantity: 1 }],
                })
                await ClickSend.sendPaymentLink(user, paymentLink.url, generatedInvoice)
                await ClickSend.sendPaymentLink(mover, paymentLink.url, generatedInvoice)
            }

            if (mode === payment_mode.PENDING || mode === payment_mode.ACCOUNT) {
                await factory.order.updateOrderPaymentStatus(order, payment_status.PENDING)
            }

            return res.status(500).send('payment request failed')
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Cancel order
     */
    static async cancelOrder(req: Request, res: Response) {
        try {
            const { orderId } = req.params
            let dbOrder: Orders
            dbOrder = await factory.order.getOrder(orderId)

            if (!dbOrder) return res.status(404).send(messages.not_found)

            dbOrder = await factory.order.updateOrderStatus(dbOrder, order_status.CANCELLED)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }
}
