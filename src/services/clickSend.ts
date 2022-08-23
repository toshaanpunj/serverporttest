import { clickSendClient } from '@utils/axiosClient'
import configs from '@configs/config'
import { Orders, Users } from '@prisma/client'

export default class ClickSend {
    /**
     * Send Email
     */
    static async sendOtpToEmail(user: Users, otp: string) {
        try {
            const emailData = {
                to: [{
                    email: user.email,
                    name: user.name,
                }],
                from: {
                    email_address_id: configs.CLICKSEND_EMAIL_ADDRESS_ID,
                    name: 'Oyo Movers',
                },
                subject: 'Email Verification',
                body: `${otp}`,
            }

            const res = await clickSendClient.post('/email/send', emailData)

            return res
        } catch (error) {
            return undefined
        }
    }

    /**
     * Send Invoice and payment link
     */
    static async sendPaymentLink(user: Users, link: string, invoice) {
        try {
            const emailData = {
                to: [{
                    email: user.email,
                    name: user.name,
                }],
                from: {
                    email_address_id: configs.CLICKSEND_EMAIL_ADDRESS_ID,
                    name: 'Oyo Movers',
                },
                subject: 'Payment Process',
                body: `${link}`,
            }

            const res = await clickSendClient.post('/email/send', emailData)

            return res
        } catch (error) {
            return undefined
        }
    }

    /**
     * Send Email
     */
    static async sendOrderStartOtp(user: Users, otp: string) {
        try {
            const emailData = {
                to: [{
                    email: user.email,
                    name: user.name,
                }],
                from: {
                    email_address_id: configs.CLICKSEND_EMAIL_ADDRESS_ID,
                    name: 'test',
                },
                subject: 'Order Start Verificatio OTP',
                body: `${otp}`,
            }

            const res = await clickSendClient.post('/email/send', emailData)

            return res
        } catch (error) {
            return undefined
        }
    }

    /**
     * Send unsafe job otp
     */
    static async sendUnsafeJobVerificationOtp(user: Users, otp: string) {
        try {
            const emailData = {
                to: [{
                    email: user.email,
                    name: user.name,
                }],
                from: {
                    email_address_id: configs.CLICKSEND_EMAIL_ADDRESS_ID,
                    name: 'test',
                },
                subject: 'Junk Removal Job Verificatio OTP',
                body: `${otp}`,
            }

            const res = await clickSendClient.post('/email/send', emailData)

            return res
        } catch (error) {
            return undefined
        }
    }

    /**
     * Send Junk removal otp
     */
    static async sendJunkRemovalOtp(user: Users, otp: string) {
        try {
            const emailData = {
                to: [{
                    email: user.email,
                    name: user.name,
                }],
                from: {
                    email_address_id: configs.CLICKSEND_EMAIL_ADDRESS_ID,
                    name: 'test',
                },
                subject: 'Junk Removal Job Verification OTP',
                body: `${otp}`,
            }

            const res = await clickSendClient.post('/email/send', emailData)

            return res
        } catch (error) {
            return undefined
        }
    }

    /**
     * Send Email
     */
    static async sendOrderCompleteOtp(user: Users, otp: string) {
        try {
            const emailData = {
                to: [{
                    email: user.email,
                    name: user.name,
                }],
                from: {
                    email_address_id: configs.CLICKSEND_EMAIL_ADDRESS_ID,
                    name: 'test',
                },
                subject: 'Order Completion Verification OTP',
                body: `${otp}`,
            }

            const res = await clickSendClient.post('/email/send', emailData)

            return res
        } catch (error) {
            return undefined
        }
    }

    /**
     * Send order update
     */
    static async sendOrderUpdate(user: Users, otp: string) {
        try {
            const emailData = {
                to: [{
                    email: user.email,
                    name: user.name,
                }],
                from: {
                    email_address_id: configs.CLICKSEND_EMAIL_ADDRESS_ID,
                    name: 'test',
                },
                subject: 'Order Start Verificatio OTP',
                body: `${otp}`,
            }

            const res = await clickSendClient.post('/email/send', emailData)

            return res
        } catch (error) {
            return undefined
        }
    }

    /**
     * Send Feedback request
     */
    static async sendOrderFeedbackRequest(user: Users, order: Orders) {
        try {
            const emailData = {
                to: [{
                    email: user.email,
                    name: user.name,
                }],
                from: {
                    email_address_id: configs.CLICKSEND_EMAIL_ADDRESS_ID,
                    name: 'test',
                },
                subject: 'Order Completed Feedback',
                body: `Pls give your feedback for your order id ${order.id} complted on ${order.order_completion_time}`,
            }

            const res = await clickSendClient.post('/email/send', emailData)

            return res
        } catch (error) {
            return undefined
        }
    }

    /**
     * Send Email
     */
    static async sendOrderStatus(user: Users, status: string) {
        try {
            const emailData = {
                to: [{
                    email: user.email,
                    name: user.name,
                }],
                from: {
                    email_address_id: configs.CLICKSEND_EMAIL_ADDRESS_ID,
                    name: 'test',
                },
                subject: 'Order Status Update',
                body: `order status updated to : ${status}`,
            }

            const message = {
                messages: [
                    {
                        ody: `order status updated to : ${status}`,
                        to: user.phone,
                    },
                ],
            }

            const smsRes = await clickSendClient.post('/sms/send', message)
            const emailRes = await clickSendClient.post('/email/send', emailData)

            return { smsRes, emailRes }
        } catch (error) {
            return undefined
        }
    }

    /**
     * Send SMS
     */
    static async sendOtpToSMS(user: Users, otp: string) {
        try {
            const message = {
                messages: [
                    {
                        body: `${otp}`,
                        to: `${configs.COUNTRY_MOB_CODE}${user.phone}`,
                    },
                ],
            }

            const res = await clickSendClient.post('/sms/send', message)

            return res
        } catch (error) {
            return undefined
        }
    }

    /**
     * Send mutliple emails
     */
}
