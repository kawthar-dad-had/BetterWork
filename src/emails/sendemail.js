const sgmail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgmail.setApiKey(sendgridAPIKey)

const sendEmail = (email,name,nameOfService,state) => {
    sgmail.send({
        to: email,
        from: 'k.dadouahadria@esi-sba.dz',
        subject: 'thanx',
        text: `welcome ${name} ihfuez ${nameOfService} HIFZAFBZBF ${state}`
    })
}
module.exports = {
    sendEmail
}