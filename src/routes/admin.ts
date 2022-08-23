import express from 'express'
import controller from '@controllers/admin/index'

import { authorizeAdmin, isAuthenticated } from '@middleware/auth'

const router = express.Router()

// get all data
router.get('/', isAuthenticated, authorizeAdmin, controller.getAllData)

// get all users
router.get('/users', isAuthenticated, authorizeAdmin, controller.getAllUsers)

// get all orders
router.get('/orders', isAuthenticated, authorizeAdmin, controller.getAllOrders)

// get all movers
router.get('/movers', isAuthenticated, authorizeAdmin, controller.getAllMovers)

// create mover
router.post('/mover', isAuthenticated, authorizeAdmin)

// create company
router.post('/company', isAuthenticated, authorizeAdmin)

// get all customers
router.get('/customers', isAuthenticated, authorizeAdmin, controller.getAllConsumers)

// get all companies
router.get('/companies', isAuthenticated, authorizeAdmin, controller.getAllCompanies)

// get all payments
router.get('/payments', isAuthenticated, authorizeAdmin, controller.getAllPayments)

// get user by user creds i.e, email or phone
router.get('/user/:userCred', isAuthenticated, authorizeAdmin, controller.getUser)

// get mover by mover creds i.e, email or phone
router.get('/mover/:moverEmail', isAuthenticated, authorizeAdmin, controller.getMover)

// get order by id
router.get('/order/:orderId', isAuthenticated, authorizeAdmin, controller.getOrder)

// get company by company creds i.e, email or phone
router.get('/company/:companyCred', isAuthenticated, authorizeAdmin, controller.getCompany)

// get payment details by id
router.get('/payments/:id', isAuthenticated, authorizeAdmin, controller.getPayment)

// get assigned mover for a order by id
router.get('/order/:orderId/mover', isAuthenticated, authorizeAdmin, controller.getAssignedMover)

router.get('/order/:orderId/updateOrderStatus', isAuthenticated, authorizeAdmin, controller.updateOrderStatus)

// get assigned orders to a mover
router.get('/mover/:moverEmail/orders', isAuthenticated, authorizeAdmin, controller.getAssignedOrdersToMover)

// update order status
router.post('/order/:orderId/updateOrderStatus', isAuthenticated, authorizeAdmin, controller.updateOrderStatus)

// assign order to mover
router.post('/mover/assignOrder', isAuthenticated, authorizeAdmin, controller.assignOrderToMover)

// unasssign an order from the mover
router.post('/mover/unassignOrder', isAuthenticated, authorizeAdmin, controller.unassignOrderFromMover)

// assign a mover to a order
router.post('/order/assignMover', isAuthenticated, authorizeAdmin, controller.assignMover)

// unassign a mover from the order
router.post('/order/unassigMover', isAuthenticated, authorizeAdmin, controller.unassignMover)

// approve a vehcile
router.put('/vehicle/approve/:vehichleId', isAuthenticated, authorizeAdmin, controller.approveVehicle)

// disapprove a vehicle
router.put('/vehicle/disapprove/:vehichleId', isAuthenticated, authorizeAdmin, controller.disapproveVehicle)

// send notification to movers
router.post('/notify', isAuthenticated, authorizeAdmin, controller.sendNotifiation)

export default router
