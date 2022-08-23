import express from 'express'
import controller from '@controllers/mover/index'
import { authorizeMover, isAuthenticated } from '@middleware/auth'

const router = express.Router()

// get mover
router.get('/', isAuthenticated, authorizeMover, controller.getMover)

// get order
router.get('/orders', isAuthenticated, authorizeMover, controller.getOrders)

// get company
router.get('/company', isAuthenticated, authorizeMover, controller.getCompany)

// add a vehicle
router.post('/addVehicle', isAuthenticated, authorizeMover, controller.addVehicle)

// update mover
router.put('/updateMover', isAuthenticated, authorizeMover, controller.updateMover)

// show vehciles
router.get('/vehicles', isAuthenticated, authorizeMover, controller.getVehicles)

// update mover
router.put('/claimOrder', isAuthenticated, authorizeMover, controller.claimOrder)

// show vehciles
router.put('/unclaimOrder', isAuthenticated, authorizeMover, controller.unclaimOrder)

// get mover's earning
router.get('/earnings/:from/:to', isAuthenticated, authorizeMover, controller.getEarnings)

export default router
