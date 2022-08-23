import prisma from '@lib/prisma'
import { Users } from '@prisma/client'

export default class UserFactory {
    /**
   * Get user by email
   */
    static async getUserByEmail(email: string) {
        const user = await prisma.users.findFirst({
            where: {
                email,
            },
            include: {
                orders: true,
                mover: true,
                invoices: true,
                payment: true,
            },
        })

        return user
    }

    /**
   * Get user by phone
   */
    static async getUserByPhone(phone: string) {
        const user = await prisma.users.findFirst({
            where: {
                phone,
            },
            include: {
                orders: true,
                mover: true,
            },
        })

        return user
    }

    /**
   * Creating new user
   */
    static async createUser(data: Users) {
        const user = await prisma.users.create({
            data: {
                ...data,
            },
        })

        return user
    }

    /**
     * Create google user
     */
    static async createGoogleUser({
        email, name, jwtToken, googleToken,
    }) {
        const user = await prisma.users.create({
            data: {
                name,
                email,
                googleAuthToken: googleToken,
                authToken: jwtToken,
            },
        })

        return user
    }

    /**
     * Update auth token
     */
    static async updateAuthToken(user: Users, token: string) {
        const dbUser = await prisma.users.update({
            where: {
                email: user.email,
            },
            data: {
                authToken: token,
            },
        })

        return dbUser
    }

    /**
     * Get email verification code
     */
    static async getEmailVerificationCode(email: string) {
        const user = await prisma.users.findFirst({
            where: {
                email,
            },
            select: {
                email_verification_code: true,
            },
        })

        return user
    }

    /**
     * Update phone verification code
     */
    static async getPhoneVerificationCode(email: string) {
        const user = await prisma.users.findFirst({
            where: {
                email,
            },
            select: {
                phone_verification_code: true,
            },
        })

        return user
    }

    /**
     * Update email verification code
     */
    static async updateEmailVerificationCode(email: string, code: number) {
        const user = await prisma.users.update({
            where: {
                email,
            },
            data: {
                email_verification_code: code,
            },
        })

        return user
    }

    /**
     * Update phone verification code
     */
    static async updatePhoneVerificationCode(email: string, code: number) {
        const user = await prisma.users.update({
            where: {
                email,
            },
            data: {
                phone_verification_code: code,
            },
        })

        return user
    }

    /**
     * Update forget password code
     */
    static async updateForgetPasswordOtp(email: string, code: number) {
        const user = await prisma.users.update({
            where: {
                email,
            },
            data: {
                password_reset_code: code,
            },
        })

        return user
    }

    /**
   * Updating the user
   */
    static async updateUser(user: Users) {
        const dbUser = await prisma.users.update({
            where: {
                email: user.email,
            },
            data: {
                ...user,
            },
        })

        return dbUser
    }

    /**
     * Update device token
     */
    static async updateDeviceToken(user: Users, deviceToken: string) {
        const dbUser = await prisma.users.update({
            where: {
                email: user.email,
            },
            data: {
                device_token: deviceToken,
            },
        })

        return dbUser
    }

    /**
   * Updating the name of the user
   */
    static async updateName(user: Users, name: string) {
        const dbUser = await prisma.users.update({
            where: {
                email: user.email,
            },
            data: {
                name,
            },
        })

        return dbUser
    }

    /**
     * Revoke token
     */
    static async revokeToken(user: Users) {
        const dbUser = await prisma.users.update({
            where: {
                email: user.email,
            },
            data: {
                authToken: null,
            },
        })

        return dbUser
    }

    /**
   * Updating the phone of the user
   */
    static async updatePhone(user: Users, phone: string) {
        const dbUser = await prisma.users.update({
            where: {
                email: user.email,
            },
            data: {
                phone,
            },
        })

        return dbUser
    }

    /**
     * updae users address
     */
    static async updateUserAddress(userEmail: string, address: string) {
        const dbUser = await prisma.users.update({
            where: {
                email: userEmail,
            },
            data: {
                address,
            },
        })

        return dbUser
    }

    /**
     * Update the pfp id
     */
    static async updatePfp(user: Users, id: string, url: string) {
        const dbUser = await prisma.users.update({
            where: {
                email: user.email,
            },
            data: {
                pfp_public_id: id,
                pfp_public_url: url,
            },
        })

        return dbUser
    }

    /**
     * Get Orders of users
     */
    static async getOrders(email: string) {
        const orders = await prisma.users.findFirst({
            where: {
                email,
            },
            select: {
                orders: true,
            },
        })

        return orders
    }

    /**
     * Update password for the user
     */
    static async resetPassword(email: string, password: string, token: string) {
        const user = await prisma.users.update({
            where: {
                email,
            },
            data: {
                password,
                authToken: token,
            },
        })

        return user
    }

    /**
     * Deletes a user
     */
    static async deleteUser(user: Users) {
        await prisma.users.delete({
            where: {
                email: user.email,
            },
        })
    }
}
