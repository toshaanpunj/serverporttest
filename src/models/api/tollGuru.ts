import { Orders } from '@prisma/client'
import { tollGuruClient } from '@utils/axiosClient'

export default class TollGuru {
    /**
     * Get tolls between a paticular way
     */
    static async getTolls(order: Orders) {
        const body = {
            from: { lat: order.pickup_address_lat, lng: order.pickup_address_long },
            to: { lat: order.destination_address_lat, lng: order.destination_address_long },

            vehicleType: '2AxlesTruck',
            departure_time: 1609507347,
            fuelPrice: 1.305,
            fuelPriceCurrency: 'USD',
            fuelEfficiency: { city: 28.57, hwy: 22.4, units: 'mpg' },
            truck: { limitedWeight: 500 },
            driver: { wage: 30, rounding: 15, valueOfTime: 0 },
            state_mileage: true,
            hos: {
                rule: 60,
                dutyHoursBeforeEndOfWorkDay: 11,
                dutyHoursBeforeRestBreak: 7,
                drivingHoursBeforeEndOfWorkDay: 11,
                timeRemaining: 60,
            },
        }
        const res = await tollGuruClient.post('/v1/calc/gmaps', body)

        return res
    }
}
