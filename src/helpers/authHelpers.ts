import jwt from 'jsonwebtoken'

export async function generateJwt(data: object, secretKey: string) {
    const token = await jwt.sign(data, secretKey, { expiresIn: '2h' })

    return token
}

export async function generateRefreshToken(data: object, secretKey: string) {
    const refreshToken = await jwt.sign(data, secretKey, { expiresIn: '30d' })

    return refreshToken
}

export async function verifyToken(token:string, secretKey: string) {
    const verified = jwt.verify(token, secretKey)

    return verified
}
