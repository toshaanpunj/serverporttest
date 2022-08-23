import { OAuth2Client } from 'google-auth-library'
import config from '@configs/config'

const client = new OAuth2Client(config.GOOGLE_AUTH_CLIENT_ID)

export default client
