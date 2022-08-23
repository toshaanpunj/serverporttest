import path from 'path'
import dotenv from 'dotenv'

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// interface for env file
interface ENV {
    PORT: number | undefined;
    SERVER_URL: string | undefined
    DATABASE_URL: string | undefined
    JWT_SECRET_KEY: string | undefined
    JWT_REFRESH_SECRET_KEY: string | undefined
    GOOGLE_AUTH_CLIENT_ID: string | undefined
    GOOGLE_AUTH_CLIENT_SECRET: string | undefined
    EMAIL: string | undefined
    EMAIL_PASS: string | undefined
    STRIPE_API_KEY: string | undefined
    AWS_SECRET_ACCESS_KEY: string | undefined
    AWS_ACCESS_ID: string | undefined
    OTP_SENDING_MAIL: string | undefined
    CLICKSEND_API_BASE_URL: string | undefined
    CLICKSEND_API_USERNAME: string | undefined
    CLICKSEND_API_KEY: string | undefined
    CLICKSEND_EMAIL: string | undefined
    CLICKSEND_EMAIL_ADDRESS_ID: string | undefined
    COUNTRY_MOB_CODE: string | undefined
    CLOUDINARY_CLOUD_NAME: string | undefined
    CLOUDINARY_API_KEY: string | undefined
    CLOUDINARY_API_SECRET: string | undefined
    TOLL_GURU_BASE_URL: string | undefined
    TOLL_GURU_API_KEY: string | undefined
}

// interface for config object generation
interface Config {
    PORT: number
    SERVER_URL: string
    DATABASE_URL: string
    JWT_SECRET_KEY: string
    JWT_REFRESH_SECRET_KEY: string
    GOOGLE_AUTH_CLIENT_ID: string
    GOOGLE_AUTH_CLIENT_SECRET: string
    EMAIL: string
    EMAIL_PASS: string
    STRIPE_API_KEY: string
    AWS_SECRET_ACCESS_KEY: string
    AWS_ACCESS_ID: string
    OTP_SENDING_MAIL: string
    CLICKSEND_API_BASE_URL: string
    CLICKSEND_API_USERNAME: string
    CLICKSEND_API_KEY: string
    CLICKSEND_EMAIL: string
    CLICKSEND_EMAIL_ADDRESS_ID: string
    COUNTRY_MOB_CODE: string
    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
    TOLL_GURU_BASE_URL: string
    TOLL_GURU_API_KEY: string
}

// Loading process.env as ENV interface
const getConfig = (): ENV => ({
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    SERVER_URL: process.env.SERVER_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
    GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
    GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    EMAIL: process.env.EMAIL,
    EMAIL_PASS: process.env.EMAIL_PASS,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_ID: process.env.AWS_ACCESS_ID,
    OTP_SENDING_MAIL: process.env.OTP_SENDING_MAIL,
    CLICKSEND_API_BASE_URL: process.env.CLICKSEND_API_BASE_URL,
    CLICKSEND_API_USERNAME: process.env.CLICKSEND_API_USERNAME,
    CLICKSEND_API_KEY: process.env.CLICKSEND_API_KEY,
    CLICKSEND_EMAIL: process.env.CLICKSEND_EMAIL,
    CLICKSEND_EMAIL_ADDRESS_ID: process.env.CLICKSEND_EMAIL_ADDRESS_ID,
    COUNTRY_MOB_CODE: process.env.COUNTRY_MOB_CODE,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    TOLL_GURU_BASE_URL: process.env.TOLL_GURU_BASE_URL,
    TOLL_GURU_API_KEY: process.env.TOLL_GURU_API_KEY,
})

// checking if all the nev are defined if not throw ann error
const getVerifiedConfig = (config: ENV): Config => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`)
        }
    }

    return config as Config
}

const config = getConfig()

const verifiedConfig = getVerifiedConfig(config)

export default verifiedConfig

