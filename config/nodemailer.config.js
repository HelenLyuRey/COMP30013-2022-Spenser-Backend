const nodemailer = require("nodemailer")
const config = require("./auth.config")
const hbs = require("nodemailer-express-handlebars")
const { google } = require("googleapis")

const CLIENT_ID = "425837192336-ol7elme3vmnlnivj7lauikr6sr2mhmjr.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04Pt0noWcYFUQCgYIARAAGAQSNwF-L9Ir-md4N-9l6GYay27C2ESIs_ienY86-JAbOniSI5s7JNE-x7iWsqpXYxFuwZk7Smma-Ec"
const ACCESS_TOKEN = "ya29.a0ARrdaM_WxK4UGVtSiTUXwNbctcKylU_Hq29E9YCp_4dpeL4y5UrAQpX9yDF4zLSojCWE4qNhw6H3IqS7fgBMeHDmz8UuzKIIM01UI9wgGkB71b9-NgqDvJ5fki4wE1idNkVzk5RGmkV44WX4-WT2ITe8U0vl"



async function sendConfirmationEmail(name, email, userId, confirmationCode) {
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
    const accessToken = await oAuth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "infoloungeteam@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            accessToken: accessToken.token
        },
    });

    transport.use("compile", hbs({
        viewEngine: {
            extname: '.hbs',
            defaultLayout: null
        },
        viewPath: "./views/"
    }))

    transport.sendMail({
        from: "infoloungeteam@gmail.com",
        to: email,
        subject: "Please verify your email at Infolounge!",
        template: "email",
        attachments: [{
            filename: "InfoLoungeLogo.png",
            path: "https://infolounge-file.s3.amazonaws.com/InfoLoungeLogo.png",
            cid: "logo"
        }, {
            filename: "OurTeam.png",
            path: "https://infolounge-file.s3.amazonaws.com/OurTeam.png",
            cid: "team"
        }],
        context: {
            firstname: name,
            user: userId,
            token: confirmationCode
        }
    }).catch(err => console.log(err));
}

module.exports = {sendConfirmationEmail}