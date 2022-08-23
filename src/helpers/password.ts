import bcrypt from 'bcrypt'
import { Users, user_type } from '@prisma/client'

export async function generateHash(password: string) {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        return hashedPassword
    } catch (err) {
        return undefined
    }
}

export async function checkPassword(password: string, dbPass: string) {
    try {
        return await bcrypt.compare(password, dbPass)
    } catch (error) {
        return undefined
    }
}

export async function checkRole(user: Users, reqRole: user_type) {
    if (user.user_type === reqRole) return true

    return false
}
