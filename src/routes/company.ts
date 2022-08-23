import express from 'express'
import controller from '@controllers/company/index'
import { authorizeAdmin, isAuthenticated } from '@middleware/auth'

const router = express.Router()

// TODO: routes for mover too be defined here

// get company
router.get('/:companyCred/movers', isAuthenticated, authorizeAdmin, controller.getMovers)

// create company
router.post('/', isAuthenticated, authorizeAdmin, controller.createCompany)

// get company by company credentials
router.get('/:companyCred', isAuthenticated, authorizeAdmin, controller.getCompany)

// update company
router.put('/:companyCred/updateCompany', isAuthenticated, authorizeAdmin, controller.updateCompany)

// delete company
router.delete('/:companyCred', isAuthenticated, authorizeAdmin, controller.deleteCompany)

export default router
