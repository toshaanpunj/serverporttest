import cloudinary from 'cloudinary'
import config from '@configs/config'

const cloud = cloudinary.v2

cloud.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true,
})

export default cloud

