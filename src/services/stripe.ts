import { Stripe } from 'stripe'
import configs from '@configs/config'

const stripe = new Stripe(configs.STRIPE_API_KEY, {
    apiVersion: '2020-08-27',
})

export default stripe
