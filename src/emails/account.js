const sgmail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgmail.setApiKey(sendgridAPIKey)

const sendPassword = (email,password) => {
    sgmail.send({
        to: email,
        from: 'k.dadouahadria@esi-sba.dz',
        subject: 'BetterWork',
        text: `your password : ${password}`
    })
}
module.exports = {
    sendPassword
}