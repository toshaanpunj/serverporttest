import express from 'express'
import controller from '@controllers/user/index'
import { authorizeUser, isAuthenticated } from '@middleware/auth'

const router = express.Router()

// get a user
router.get('/orders', isAuthenticated, authorizeUser, controller.getOrders)

// get user by user credential
router.get('/:userCred', isAuthenticated, authorizeUser, controller.getUser)

// update an user
router.put('/updateUser', isAuthenticated, authorizeUser, controller.updateUser)

// update name of the user
router.put('/updateName', isAuthenticated, authorizeUser, controller.updateName)

// update name of the user
router.put('/updateAddress', isAuthenticated, authorizeUser, controller.updateAddress)

// edit phone
router.put('/editPhone', isAuthenticated, authorizeUser, controller.editPhone)

// subscribe to push notifications
router.put('/susbscribeNotifications', isAuthenticated, authorizeUser, controller.subscribeForPushNotification)

// edit profile
router.put('/editProfile', isAuthenticated, authorizeUser, controller.updateUser)

// verify phone
router.post('/verifyPhone', isAuthenticated, controller.verifyPhone)

// verify email
router.post('/verifyEmail', isAuthenticated, controller.verifyEmail)

// verify phone otp
router.post('/verifyPhoneOtp', isAuthenticated, controller.verifyPhoneOtp)

// verify email otp
router.post('/verifyEmailOtp', isAuthenticated, controller.verifyEmailOtp)

// reset password
router.put('/resetPassword', isAuthenticated, authorizeUser, controller.resetPassword)

// delete an user
router.delete('/', isAuthenticated, authorizeUser, controller.deleteUser)

export default router
