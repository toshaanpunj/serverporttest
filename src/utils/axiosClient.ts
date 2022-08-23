import axios from 'axios'
import config from '@configs/config'

export const clickSendClient = axios.create({
    baseURL: config.CLICKSEND_API_BASE_URL,
    headers: {
        Authorization: config.CLICKSEND_API_KEY,
        ContentType: 'application/json',
    },
})

export const tollGuruClient = axios.create({
    baseURL: config.TOLL_GURU_BASE_URL,
    headers: {
        'x-api-key': config.TOLL_GURU_API_KEY,
        ContentType: 'application/json',
    },
})

