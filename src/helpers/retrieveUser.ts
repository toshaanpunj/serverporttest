import { verifyToken } from '@helpers/authHelpers'
import config from '@configs/config'
import factory from '@factory/index'
import { Users } from '@prisma/client'

export default async function retrieveUser(req) {
    const token = req.headers.authorization.split(' ')[1]

    const decodedPayload = await verifyToken(token, config.JWT_SECRET_KEY)

    const { email } = <any>decodedPayload
    const { phone } = <any>decodedPayload

    let dbUser: Users
    if (email) dbUser = await factory.user.getUserByEmail(email)
    else dbUser = await factory.user.getUserByPhone(phone)

    return dbUser
}
