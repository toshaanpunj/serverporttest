import express from 'express'
import controller from '@controllers/order/index'
import { authorizeMover, authorizeUser, isAuthenticated } from '@middleware/auth'

const router = express.Router()

// get order
router.get('/:orderId', isAuthenticated, authorizeUser, controller.getOrder)

// create order
router.post('/', isAuthenticated, authorizeUser, controller.createOrder)

// get movers of the orders
router.get('/:ordreId/movers', isAuthenticated, authorizeUser, controller.getMovers)

// get vehicle
router.get('/:orderId/vehicle', isAuthenticated, controller.getVehicle)

// get order status
router.get('/:ordreId', isAuthenticated, authorizeUser, controller.getOrderStatus)

// update order status
router.put('/:orderId/updateStatus', isAuthenticated, authorizeUser, controller.updateOrderStatus)

// start the order
router.put('/:orderId/startOrder', isAuthenticated, authorizeMover, controller.startOrder)

// verify start order otp
router.post('/:orderId/verifyOrderStartOtp', isAuthenticated, authorizeMover, controller.verifyStartOrder)

// junk removal job register
router.post('/junkRemovalJob', isAuthenticated, authorizeMover, controller.junkRemovalInitiation)

// verify junk removal job otp
router.post('/verifyJunkRemovalOtp', isAuthenticated, authorizeMover, controller.verifyJunkRemovalOtp)

// unsafe job consent
router.post('/unsafeJobConsent', isAuthenticated, authorizeMover, controller.unsafeJobConsentInitiation)

// verify unsafe job consent otp
router.post('/verifyUnsafeJobOtp', isAuthenticated, authorizeMover, controller.verifyUnsafeJobOtp)

// complete the order
router.put('/:orderId/completeOrder', isAuthenticated, authorizeMover, controller.completeOrder)

// verify order completion otp
router.post('/:orderId/verifyOrderCompletionOtp', isAuthenticated, authorizeMover, controller.verifyCompletionOrder)

// update payment status
router.post('/:orderId/updatePaymentStatus', isAuthenticated, authorizeMover, controller.updatePaymentStatus)

// update order rating and review
router.post('/:orderId/updateRatingReview', isAuthenticated, authorizeUser, controller.uppdateRatingReview)

// get order rating and review
router.get('/:orderId/getRatingReview', isAuthenticated, authorizeUser, controller.getRatingReview)

// get order Images
router.get('/:orderId/orderImages', isAuthenticated, controller.getOrderImages)

// get invoide
router.get('/orderId/invoice', isAuthenticated, controller.getInvoice)

// update junk removal items
router.post('/:orderId/updateJunkRemovalItems', isAuthenticated, authorizeMover, controller.updateJunkRemovalItems)

// update tolls
router.post('/:orderId/updateTolls', isAuthenticated, controller.updateTolls)

// update other expenses
router.post('/:orderId/updateOtherExpense', isAuthenticated, authorizeMover, controller.updateOtherExpense)

// payment route
router.post('/:orderId/payment', isAuthenticated, authorizeUser, controller.payment)

// cancel order
router.put('/:orderId/cancel', isAuthenticated, controller.cancelOrder)

export default router
