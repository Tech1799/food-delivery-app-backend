const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const verificationMail = (email, otp) => {
    const message = {
        to: email,
        from: 'bhupindersharma1799@gmail.com',
        subject: 'OTP verification Mail',
        text: 'Thakali Khana Project',
        html: `
            <h1>Your Email Verification code:</h1>
            <h3>${otp}</h3>
        `
    }
    return new Promise((resolve, reject) => {
        sgMail.send(message, (error, info) =>
          error ? reject(error) : resolve(info)
        )
      })
}




module.exports = {
    verificationMail
}