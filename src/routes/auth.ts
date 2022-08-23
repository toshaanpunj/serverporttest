import express from 'express'
import controller from '@controllers/auth/index'

const router = express.Router()

router.post('/signup', controller.signUp)

router.post('/signin', controller.signIn)

router.post('/googleAuth', controller.googleAuth)

router.post('/forgetPassword', controller.sendForgetPassword)

router.post('/confirmForgetPasswordOtp', controller.confimForgetPasswordOtp)

router.put('/resetPassword', controller.resetForgetPassword)

router.post('/signOut', controller.signout)

router.post('/revalidateToken', controller.revalidateToken)

export default router
