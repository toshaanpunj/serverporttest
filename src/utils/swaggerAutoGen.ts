
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerAutogen from 'swagger-autogen'
import path from 'path'
import fs from 'fs'

const endPointsFiles = fs.readdirSync(path.resolve(__dirname, '../routes/'))
// const endPointsFiles = [`${path.resolve(__dirname, "../routes/index.ts")}`]
const outputFile = ('./swagger_output.json')

const options: swaggerJSDoc.Options = {

    definition: {
        swagger: '2.0.0',
        info: {
            title: 'oyo-movers backend api doc',
            version: '',
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
    await swaggerAutogenFn()(outputFile, endPointsFiles, options).then(async () => {
        await import('../../index') // Your project's root file
    })
}

swaggerGenarateDoc(swaggerAutogen)
