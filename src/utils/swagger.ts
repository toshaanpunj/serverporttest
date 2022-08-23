import swaggerUI from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { Express, Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import swaggerAutogen from 'swagger-autogen'
import logger from '@utils/logger'

const files = fs.readdirSync(path.resolve(__dirname, '../routes/'))

const endPointsFiles = []

files.forEach((file) => {
    endPointsFiles.push(path.join(`${path.resolve(__dirname, '../routes/')}`, file))
})

const outputFile = ('../swagger_output.json')

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'oyo-movers backend api doc',
            version: '1.0.0',
        },
        host: 'localhost:1529',
        components: {
            securitySchema: {
                bearerAuth: {
                    type: 'http',
                    schema: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: endPointsFiles,
}

async function swaggerGenarateDoc(swaggerAutogenFn) {
    try {
        await swaggerAutogenFn()(outputFile, endPointsFiles, options).then(async () => {
            await import('../../index') // Your project's root file
        })
    } catch (error) {
        return undefined
    }
}

// swaggerGenarateDoc(swaggerAutogen)

async function swaggerDocs(app: Express, port: number) {
    const swaggerDocument = await import (path.resolve(__dirname, '../../swagger_output.json'))
    // swagger page
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
    // Docs in json format
    app.get('docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-type', 'application/json')
        res.send(swaggerDocument)
    })
    logger.info(`docs aree avaiable at http://localhost:${port}/docs`)
}

export default swaggerDocs
