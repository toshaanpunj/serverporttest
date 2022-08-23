import express from 'express'
import auth from '@routes/auth'
import user from '@routes/user'
import order from '@routes/order'
import mover from '@routes/mover'
import admin from '@routes/admin'
import company from '@routes/company'

const router = express.Router()

// auth routes
router.use('/auth', auth)

// user routes
router.use('/user', user)

// order routes
router.use('/order', order)

// mover routes
router.use('/mover', mover)

// admin routes
router.use('/admin', admin)

// company routes
router.use('/company', company)

export default router
