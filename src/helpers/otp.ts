export default function generateOtp() {
    const otp = Math.floor((Math.random() * 10000) + 54)

    return otp
}
