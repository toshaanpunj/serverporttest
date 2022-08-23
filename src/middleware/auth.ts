import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import messages from '@constants/messages'
import { user_type } from '@prisma/client'
import factory from '../models/factory/index'
import config from '../configs/config'

/**
 * Is Authenticated
 */
export async function isAuthenticated(req: Request, res:Response, next: NextFunction) {
    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) return res.status(401).send(messages.token_not_found)
        const decoded = jwt.verify(token, config.JWT_SECRET_KEY)

        const { email } = decoded as any
        const dbUser = await factory.user.getUserByEmail(email)

        if (dbUser) return next()

        return res.status(400).send(messages.unauthorized_req)
    } catch (error) {
        return res.status(500).send('Server error occured')
    }
}

/**
 * Authorize user
 */

export async function authorizeUser(req: Request, res:Response, next: NextFunction) {
    try {
        const token = req.headers.authorization.split(' ')[1]

        const decoded = jwt.verify(token, config.JWT_SECRET_KEY)

        const { email } = decoded as any
        const dbUser = await factory.user.getUserByEmail(email)

        if (dbUser.user_type === user_type.USER) return next()

        return res.status(400).send(messages.unauthorized_req)
    } catch (error) {
        return res.status(500).send('Server error occured')
    }
}

/**
 * Authorize admin
 */
export async function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization.split(' ')[1]

        const decoded = jwt.verify(token, config.JWT_SECRET_KEY)

        const { email } = decoded as any
        const dbUser = await factory.user.getUserByEmail(email)

        if (dbUser.user_type === user_type.ADMIN) return next()

        return res.status(400).send(messages.unauthorized_req)
    } catch (error) {
        return res.status(500).send('Server error occured')
    }
}

/**
 * Authorize mover
 */
export async function authorizeMover(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization.split(' ')[1]

        const decoded = jwt.verify(token, config.JWT_SECRET_KEY)

        const { email } = decoded as any
        const dbUser = await factory.user.getUserByEmail(email)

        if (dbUser.user_type === user_type.MOVER) return next()

        return res.status(400).send(messages.unauthorized_req)
    } catch (error) {
        return res.status(500).send('Server error occured')
    }
}

