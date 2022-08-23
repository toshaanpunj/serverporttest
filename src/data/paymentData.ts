import { order_type } from '@prisma/client'

const service1 = {
    vehcileType: order_type.ONE_MAN_TRUCK,
    baseCharges: 50,
    halfHourlyCharges: 50,
    stripeProductId: 'prod_MFRA7M9Wi51YrE',
}

const service2 = {
    vehcileType: order_type.TWO_MEN_TRUCK,
    baseCharges: 55,
    halfHourlyCharges: 55,
    stripeProductId: 'prod_MFRCx7iQ1nDNO6',
}

const service3 = {
    vehcileType: order_type.TWO_MEN_MEDIUM_TRUCK,
    baseCharges: 75,
    halfHourlyCharges: 75,
    stripeProductId: 'prod_MFRDKx5o8UpprG',
}

const service4 = {
    vehcileType: order_type.ONE_MAN_LARGE_TRUCK,
    baseCharges: 85,
    halfHourlyCharges: 85,
    stripeProductId: 'prod_MFREmPMaM8Z5x1',
}

export default [
    service1, service2, service3, service4,
]
