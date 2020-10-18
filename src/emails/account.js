const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmailCustomer = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gautamsaini455@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the Online Food Delivery App, ${name}. Let me know how you get along with the app.`
    })


}

const sendWelcomeEmailRestaurant = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gautamsaini455@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the Online Food Delivery App, ${name}. Thanks for joining in as restaurant partner. I hope you will enjoy our future relationship.`
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
    sendWelcomeEmailCustomer,
    sendWelcomeEmailRestaurant

}