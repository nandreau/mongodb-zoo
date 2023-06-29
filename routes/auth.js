import express from 'express'

const router = express.Router()

router.put('/signup', authController.signup)
router.post('/login', authController.login)


export default router