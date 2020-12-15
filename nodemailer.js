const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.BUSINESS_EMAIL,
        clientId: process.env.GOOGLE_API_CLIENT_ID,
        clientSecret: process.env.GOOGLE_API_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_API_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_API_ACCESS_TOKEN
    }
})

module.exports = transporter;
// const test = ''

// let mailOptions = {
//     from: 'heraclass.tester@gmail.com',
//     to: 'j65hcl@gmail.com',
//     subject: 'Testing and testing',
//     html: test
// }

// transporter.sendMail(mailOptions, function (err, data) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log('email sent')
//     }
// })