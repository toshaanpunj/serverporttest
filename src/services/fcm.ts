import { Users } from '@prisma/client'
import firebaseAdmin from '@lib/firebaseAdmin'

export async function sendNotification(message, user: Users) {
    try {
        if (user.device_token) {
            const response = await firebaseAdmin.messaging().sendToDevice(user.device_token, message)

            return response
        }

        return
    } catch (error) {
        return undefined
    }
}

export async function sendNotificationToMulitpleDevices(message, users: Users[]) {
    try {
        const tokens = users.map((user) => { if (user.device_token) return user.device_token })
        const response = await firebaseAdmin.messaging().sendToDevice(tokens, message)

        return response
    } catch (error) {
        return undefined
    }
}

export async function sendNotificationToTopic(topic, message) {
    try {
        const response = await firebaseAdmin.messaging().sendToTopic(topic, message)

        return response
    } catch (error) {
        return undefined
    }
}

