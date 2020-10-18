const sgMail = require('@sendgrid/mail')

sgMail.setApiKey('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')

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gautamsaini455@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })


}

// const sendCancelationEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'gautamsaini455@gmail.com',
//         subject: 'Sorry to see you go!',
//         text: `Goodbye, ${name}. I hope to see you back sometime soon.`
//     })
// }

module.exports = {
    sendWelcomeEmail      
}