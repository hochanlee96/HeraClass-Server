const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'j65hcl@gmail.com',
        clientId: '350520742740-9hml57j4kd3vv74vja6fbp40vj1q7qho.apps.googleusercontent.com',
        clientSecret: '250cWXdXfo9rAE4GKuiDw5DB',
        refreshToken: '1//04Q0eC4WJIj-6CgYIARAAGAQSNwF-L9IrDautg0qdBLoayszffISds0EDhOJAgAExHhPWeNROMMOdXN2JCIPgGAo-o5JsHQWc6H8',
        accessToken: 'ya29.a0AfH6SMCyDB0MY_f6tQp3kP2bqAQ29gJ5rXM4hP2BpGjGCJEhb1MHr-2DPndPJ8VrWEQlJCuCjdmVPivH1H8OIEidtvYMDuFMqzv8U056nnCWnAR--iJi-vT4Ms8SOFclUbNkUCPZLeOiMeJPemA1XLTriiansc4Rdh2Vb7UdWEA'
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