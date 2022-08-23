import { Users } from '@prisma/client'
import cloudinary from '@lib/cloudinary'
import { UploadApiResponse } from 'cloudinary'

export default class CloudinaryAPI {
    /**
     * to upload the image
     */
    static async uploadImage(image: string, dir:string): Promise<UploadApiResponse> {
        try {
            const cloudResponse = await cloudinary.uploader.upload(image, { folder: dir })

            return cloudResponse
        } catch (error) {
            return undefined
        }
    }

    /**
     * Update the preexisitng asset in the cloud
     */
    static async updateImage(dbUser: Users, updatedImage: string, dir:string): Promise<UploadApiResponse> {
        try {
            await cloudinary.uploader.destroy(dbUser.pfp_public_id)

            const cloudResponse = await cloudinary.uploader.upload(updatedImage, { folder: dir })

            return cloudResponse
        } catch (error) {
            return undefined
        }
    }

    /**
     * get invoice
     */
    static async getInvoice(invoiceId: string) {
        try {
            const cloudResponse = await cloudinary.api.resources_by_ids(invoiceId)

            return cloudResponse
        } catch (error) {
            return undefined
        }
    }

    /**
     * get multiple invoices
     */
    static async getMultipleInvoice(invoiceIds: string[]) {
        try {
            const cloudResponse = await cloudinary.api.resources_by_ids(invoiceIds)

            return cloudResponse
        } catch (error) {
            return undefined
        }
    }

    /**
     * to destroy an asset in the cloud
     */
    static async destroyImage(publicId: string) {
        try {
            const cloudRes = await cloudinary.uploader.destroy(publicId)

            return cloudRes
        } catch (error) {
            return undefined
        }
    }

    /**
     * upload invoice pdf
     */
    static async uploadPdf(file, dir:string) {
        try {
            const cloudRes = await cloudinary.uploader.upload(file, { folder: dir })

            return cloudRes
        } catch (error) {
            return undefined
        }
    }

    /**
     * delete invoice pdf
     */
    static async deletePdf(publicId: string) {
        try {
            const cloudRes = await cloudinary.uploader.destroy(publicId)

            return cloudRes
        } catch (error) {
            return undefined
        }
    }

    /**
     * to get static data images
     * @returns
     */
    static async getStaticFiles(folderPath? : string) {
        try {
            const searchRespose = await cloudinary.search.expression(`folder:${folderPath}`).execute()
            const publicIds = Array.from(searchRespose.resources.map((res) => res.public_id))
            const adminRespose = await cloudinary.api.resources({ resource_type: 'image', public_ids: publicIds })

            return adminRespose
        } catch (error) {
            return undefined
        }
    }
}

