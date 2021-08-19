const sgmail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgmail.setApiKey(sendgridAPIKey)

const sendCode = (email,code) => {
    sgmail.send({
        to: email,
        from: 'k.dadouahadria@esi-sba.dz',
        subject: 'forgot password',
        text: ` code: ${code}`
    })
}
module.exports = {
    sendCode
}