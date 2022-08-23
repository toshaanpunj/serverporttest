import { Orders, Users } from '@prisma/client'

export default function buildNotification(order: Orders, user: Users, type) {
    const message = {
        data: {
            title: 'ORDER PLACED',
            order,
            user,
        },
    }

    return message
}

