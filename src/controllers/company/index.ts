import { Request, response, Response } from 'express'
import messages from '@constants/messages'
import factory from '@factory/index'
import retrieveUser from '@helpers/retrieveUser'

export default class CompanyController {
    /**
     * create company
     */
    static async createCompany(req: Request, res: Response) {
        try {
            const companyData = req.body
            const companyCreated = await factory.company.createCompany(companyData)

            return res.status(200).json(companyCreated)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * get movers of the company
     */
    static async getMovers(req: Request, res: Response) {
        try {
            const { companyCred } = req.params

            const companyMovers = await factory.company.getMovers(companyCred)

            return res.status(200).json(companyMovers)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Get company
     */
    static async getCompany(req: Request, res: Response) {
        try {
            const { companyCred } = req.params

            const company = await factory.company.getCompany(companyCred)

            if (company) return res.status(200).json(company)

            return res.status(404).send(messages.not_found)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Update mover
     */
    static async updateCompany(req: Request, res: Response) {
        try {
            const { companyCred } = req.params
            const company = await factory.company.getCompany(companyCred)
            const updatedCompanyData = { ...req.body }
            const updatedCompany = await factory.company.updateCompany(updatedCompanyData)

            return res.status(200).json(updatedCompany)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }

    /**
     * Delete  mover
     */
    static async deleteCompany(req: Request, res: Response) {
        try {
            const { companyCred } = req.params
            const company = await factory.company.getCompany(companyCred)
            await factory.company.deleteCompany(company)

            return res.status(200).json(messages.delete_success)
        } catch (error) {
            return res.status(500).send(messages.serverError)
        }
    }
}
