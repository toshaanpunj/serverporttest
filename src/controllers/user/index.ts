import { Request, Response } from 'express'
import messages from '@constants/messages'
import factory from '@factory/index'
import jwt from 'jsonwebtoken'
import { checkPassword, generateHash } from '@helpers/password'
import generateOtp from '@helpers/otp'
import config from '@configs/config'
import { Users, user_type } from '@prisma/client'
import retrieveUser from '@helpers/retrieveUser'
import clickSend from '@services/clickSend'
import firebaseAdmin from '@lib/firebaseAdmin'
import CloudinaryAPI from '@api/cloudinary'
import cloudinaryConstants from '@constants/cloudinary'
import stripe from '@services/stripe'
import { UploadApiResponse } from 'cloudinary'
import logger from '@utils/logger'

export default class UserController {
    /**
     * Get user
     */
    static async getUser(req: Request, res: Response) {
        // #swagger.description = 'to get the user'
        try {
            const userCred = <any>req.params.userCred
            let email: string
            let phone: string
            if (userCred.split('').includes('@')) email = userCred
            else phone = userCred

            let dbUser: Users
            if (email) dbUser = await factory.user.getUserByEmail(email)
            else dbUser = await factory.user.getUserByPhone(phone)

            return res.status(200).json(dbUser)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get orders
     */
    static async getOrders(req: Request, res: Response) {
        try {
            const { status } = req.query
            const user = await retrieveUser(req)
            let orders
            const dbOrders = await factory.user.getOrders(user.email)
            if (status) orders = dbOrders.orders.filter((order) => { if (order.order_status === status) return order })
            else orders = dbOrders.orders

            return res.status(200).json(orders)
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

            let cloudResponse: UploadApiResponse
            if (user.pfp_public_id) {
                cloudResponse = await CloudinaryAPI.uploadImage(image, cloudinaryConstants.PFP_DIR)
            } else {
                cloudResponse = await CloudinaryAPI.updateImage(user, image, cloudinaryConstants.PFP_DIR)
            }

            const updatedUser = await factory.user.updatePfp(user, cloudResponse.public_id, cloudResponse.secure_url)

            return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Update users
     */
    static async updateUser(req: Request, res: Response) {
        try {
            const updatedUserData = { ...req.body }
            const updatedUser = await factory.user.updateUser(updatedUserData)

            return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Create user
     */
    static async createUser(req: Request, res:Response) {
        try {
            const dbUser = await factory.user.getUserByEmail(req.body.email)
            if (dbUser) {
                return res.status(409).send('user already exists')
            }
            const userData = { ...req.body }
            const hashedPassword = await generateHash(userData.password)
            const token = await jwt.sign({ username: userData.username, email: userData.email }, config.JWT_SECRET_KEY)
            userData.password = hashedPassword
            userData.authToken = token

            await factory.user.createUser(userData)

            return res.status(201).send('user successfully signed up')
        } catch (err) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
         * Subscribe to push notifications
         */
    static async subscribeForPushNotification(req: Request, res:Response) {
        try {
            const dbUser = await retrieveUser(req)
            const { deviceToken } = req.body
            await factory.user.updateDeviceToken(dbUser, deviceToken)

            return res.status(200).send(messages.success)
        } catch (err) {
            return res.status(500).send(messages.serverError)
        }
    }

    /** *
         * Subscribe to topic for push notification
         */
    static async subscribeToTopic(req: Request, res: Response) {
        try {
            const user = await retrieveUser(req)
            const topic = user.user_type === user_type.USER ? 'USERS' : 'MOVERS'

            await firebaseAdmin.messaging().subscribeToTopic(user.device_token, topic)

            return res.status(200).send(messages.success)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
         * Edit user's phone
         */
    static async editPhone(req: Request, res: Response) {
        try {
            const user = await retrieveUser(req)
            const phone = <string>req.body.phone

            // TODO: send an otp

            const updatedUser = await factory.user.updatePhone(user, phone)

            return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
         * Delete a user
         */
    static async deleteUser(req: Request, res:Response) {
        try {
            const dbUser = await retrieveUser(req)
            await factory.user.deleteUser(dbUser)

            return res.status(200).send(messages.delete_success)
        } catch (err) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
         * Add mobile number to the user
         */
    static async addPhone(req: Request, res: Response) {
        try {
            const dbUser = await retrieveUser(req)
            if (dbUser) dbUser.phone = req.body.phone
            else return res.status(404).send(messages.not_found)

            await factory.user.updateUser(dbUser)

            return res.status(200).send(messages.success)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
         * update name
         */
    static async updateName(req: Request, res: Response) {
        try {
            const dbUser = await retrieveUser(req)

            const updatedUser = await factory.user.updateName(dbUser, req.body.name)

            return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
         * update address
         */
    static async updateAddress(req: Request, res: Response) {
        try {
            const dbUser = await retrieveUser(req)

            const updatedUser = await factory.user.updateUserAddress(dbUser.email, req.body.address)

            return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /** *
         * verify Phone
         */
    static async verifyPhone(req: Request, res:Response) {
        try {
            const { phone, email } = req.body
            let dbUser = await factory.user.getUserByPhone(phone)

            if (!dbUser) dbUser = await factory.user.getUserByEmail(email)

            let updtedUser = await factory.user.updatePhone(dbUser, phone)

            const otp = generateOtp()
            const clickSendResponse = await clickSend.sendOtpToSMS(updtedUser, `${otp}`)
            updtedUser = await factory.user.updatePhoneVerificationCode(dbUser.email, otp)

            if (clickSendResponse.status === 200) return res.status(200).send(messages.otp_sent)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /** *
         * verify Email
         */
    static async verifyEmail(req: Request, res:Response) {
        try {
            const dbUser = await retrieveUser(req)
            const otp = generateOtp()
            await clickSend.sendOtpToEmail(dbUser, `${otp}`)
            await factory.user.updateEmailVerificationCode(dbUser.email, otp)

            return res.status(200).send(messages.otp_sent)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /** *
         * verify Phone Otp
         */
    static async verifyPhoneOtp(req: Request, res:Response) {
        try {
            const { otp, phone, email } = req.body

            let dbUser: Users
            if (phone) dbUser = await factory.user.getUserByPhone(phone)
            else dbUser = await factory.user.getUserByEmail(email)

            if (dbUser.phone_verification_code === Number(otp)) return res.status(200).send(messages.success)

            return res.status(400).send(messages.invalid_otp)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /** *
         * verify Email Otp
         */
    static async verifyEmailOtp(req: Request, res:Response) {
        try {
            const { otp } = req.body
            if (!otp) return res.status(400).send('OTP not found')
            const dbUser = await retrieveUser(req)
            if (dbUser.email_verification_code === otp) return res.status(200).send(messages.otp_verified)

            return res.status(400).send(messages.invalid_otp)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /** *
         * verify Email Otp
         */
    static async resetPassword(req: Request, res:Response) {
        try {
            const dbUser = await retrieveUser(req)
            const { currentPass } = req.body
            const isAuthenticated = checkPassword(currentPass, dbUser.password)
            const newHashedPass = await generateHash(req.body.newPassword)
            if (isAuthenticated) dbUser.password = newHashedPass

            const updatedUser = await factory.user.updateUser(dbUser)

            return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Verify card
     */
    static async verifyCard(req: Request, res:Response) {
        try {
            logger.info('testing')
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }
}
