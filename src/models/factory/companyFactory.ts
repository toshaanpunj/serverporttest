import prisma from '@lib/prisma'
import { Company, Movers } from '@prisma/client'

export default class CompanyFactory {
    /**
     * Create a new mover
     */
    static async createCompany(companyData: Company): Promise<Company> {
        const companyCreated = await prisma.company.create({
            data: {
                ...companyData,
            },
        })

        return companyCreated
    }

    /**
         * Get mover
         */
    static async getCompany(email: string): Promise<Company> {
        const company = await prisma.company.findFirst({
            where: {
                email,
            },
            include: {
                movers: true,
            },
        })

        return company
    }

    /**
         * get orders assigned to a mover
         */
    static async getMovers(email: string): Promise<Movers[]> {
        const companyMovers = await prisma.company.findFirst({
            where: {
                email,
            },
            select: {
                movers: true,
            },
        })
        const dbMovers: Movers[] = []
        companyMovers.movers.map(async (m) => {
            const mover = await prisma.movers.findFirst({
                where: {
                    moverEmail: m.moverEmail,
                },
                include: {
                    user: true,
                },
            })

            dbMovers.push(mover)
        })

        return dbMovers
    }

    /**
         * Update Order
         */

    static async updateCompany(company: Company): Promise<Company> {
        const updatedCompany = await prisma.company.update({
            where: {
                email: company.email,
            },
            data: {
                ...company,
            },
        })

        return updatedCompany
    }

    static async deleteCompany(company: Company): Promise<void> {
        await prisma.company.delete({
            where: {
                email: company.email,
            },
        })
    }
}
