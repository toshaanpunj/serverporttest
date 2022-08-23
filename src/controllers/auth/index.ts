import { Request, Response } from 'express'
import messages from '@constants/messages'
import factory from '@factory/index'
import { checkPassword, checkRole, generateHash } from '@helpers/password'
import jwt from 'jsonwebtoken'
import config from '@configs/config'
import { Users, user_type } from '@prisma/client'
import { generateJwt, generateRefreshToken } from '@helpers/authHelpers'
import retrieveUser from '@helpers/retrieveUser'
import generateOtp from '@helpers/otp'
import clickSendClient from '@services/clickSend'

export default class AuthController {
    /**
     *  Sign up the user
     */
    static async signUp(req: Request, res: Response) {
        try {
            const dbUser = await factory.user.getUserByEmail(req.body.email)
            if (dbUser) {
                return res.status(409).send('user already exists')
            }
            const userData: Users = { ...req.body }
            const hashedPassword = await generateHash(userData.password)
            const token = await generateJwt({ user_type: userData.user_type, email: userData.email }, config.JWT_SECRET_KEY)
            const refreshToken = await generateRefreshToken({ user_type: userData.user_type, email: userData.email }, config.JWT_REFRESH_SECRET_KEY)
            userData.password = hashedPassword
            userData.authToken = refreshToken

            const user = await factory.user.createUser(userData)

            return res.status(201).json({
                token, refreshToken, user, message: messages.signup_success,
            })
        } catch (err) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * logging in user
     */
    static async signIn(req: Request, res: Response) {
        try {
            const { email, phone, userType } = req.body
            let dbUser
            if (email) dbUser = await factory.user.getUserByEmail(email)
            else dbUser = await factory.user.getUserByPhone(phone)
            if (!dbUser) return res.status(404).send('Invalid username/password')

            const isAuthenticated = await checkPassword(req.body.password, dbUser.password)
            const verifiedRole = await checkRole(dbUser, userType)
            if (!isAuthenticated || !verifiedRole) return res.status(404).send('Invalid Username/password')

            const token = await generateJwt({ user_type: dbUser.user_type, email: dbUser.email }, config.JWT_SECRET_KEY)

            const refreshToken = await generateRefreshToken({ user_type: dbUser.user_type, email: dbUser.email }, config.JWT_REFRESH_SECRET_KEY)

            const updatedUser = await factory.user.updateAuthToken(dbUser, refreshToken)

            return res.status(200).json({
                token, refreshToken, user: updatedUser, message: messages.login_success,
            })
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Google sign in the user
     */
    static async googleAuth(req: Request, res: Response) {
        try {
            const { token, userType } = req.body

            const user = await jwt.decode(token, { json: true })

            const { name, email } = user
            const dbUser = await factory.user.getUserByEmail(email)

            if (dbUser) {
                const refresh_token = await generateRefreshToken({ user_type: dbUser.user_type, email: dbUser.email }, config.JWT_REFRESH_SECRET_KEY)
                const updatedUser = await factory.user.updateAuthToken(dbUser, refresh_token)

                return res.status(200).json({
                    token, refresh_token, user: updatedUser, message: messages.login_success,
                })
            }

            const jwtToken = await generateJwt({ user_type: userType, email }, config.JWT_SECRET_KEY)

            const refresh_token = await generateRefreshToken({ user_type: userType, email }, config.JWT_REFRESH_SECRET_KEY)
            const updatedUser = await factory.user.createGoogleUser({
                email, name, jwtToken: refresh_token, googleToken: token,
            })

            return res.status(200).json({
                token: jwtToken, refresh_token, user: updatedUser, message: messages.signup_success,
            })
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Regenerate token
     */
    static async revalidateToken(req: Request, res: Response) {
        try {
            const { token } = req.body

            const refresh_token = token.split(' ')[1]
            const decodedPayload = await jwt.verify(refresh_token, config.JWT_REFRESH_SECRET_KEY)

            const { email } = decodedPayload as any
            const { phone } = decodedPayload as any

            let dbUser: Users
            if (email) dbUser = await factory.user.getUserByEmail(email)
            else dbUser = await factory.user.getUserByPhone(phone)

            let newToken: string
            if (dbUser.authToken === refresh_token) newToken = await generateJwt({ email: dbUser.email, user_type: dbUser.user_type }, config.JWT_SECRET_KEY)

            return res.status(200).json({ token: newToken, messages: 'new tokenn generated succesfully' })
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     *Send forget password otp
     */
    static async sendForgetPassword(req: Request, res: Response) {
        try {
            const { email, phone, userType } = req.body
            if ((!email && !phone) || !userType) return res.status(400).send(messages.bad_req)
            if (email) {
                const dbUser = await factory.user.getUserByEmail(email)
                if (!dbUser) return res.status(404).send(messages.not_found)
                const otp = generateOtp()

                if (email) await clickSendClient.sendOtpToEmail(dbUser, `${otp}`)
                if (phone) await clickSendClient.sendOtpToSMS(dbUser, `${otp}`)

                await factory.user.updateForgetPasswordOtp(email, otp)

                return res.status(200).send(messages.otp_sent)
            }

            if (phone) {
                const dbUser = await factory.user.getUserByPhone(phone)
                if (!dbUser) return res.status(404).send(messages.not_found)

                // await sendMessage()
                return res.status(200).send(messages.otp_sent)
            }
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * reset forgot password
     */
    static async confimForgetPasswordOtp(req: Request, res: Response) {
        try {
            const { otp, email, phone } = req.body

            if (!otp || (!email && !phone)) return res.send(400).send(messages.bad_req)

            let dbUser
            if (email) dbUser = await factory.user.getUserByEmail(email)
            if (phone) dbUser = await factory.user.getUserByPhone(phone)
            if (dbUser.password_reset_code === otp) {
                await factory.user.updateForgetPasswordOtp(email, null)

                return res.status(200).send(messages.otp_verified)
            }

            return res.status(400).send(messages.invalid_otp)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * reset password
     */
    static async resetForgetPassword(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const dbUser = await factory.user.getUserByEmail(email)

            const newhashedPassword = await generateHash(password)
            const isOldPassword = await checkPassword(password, dbUser.password)
            if (isOldPassword) return res.status(409).send('New password should not mactch the previous one')

            const token = jwt.sign({ user_type, email }, config.JWT_SECRET_KEY)

            const user = await factory.user.resetPassword(email, newhashedPassword, token)

            return res.status(200).json(user)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * signout user
     */
    static async signout(req: Request, res: Response) {
        const user = await retrieveUser(req)

        await factory.user.revokeToken(user)

        return res.status(200).send('suucessfully logout')
    }
}
