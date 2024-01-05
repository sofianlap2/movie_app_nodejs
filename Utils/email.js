const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

const sendEmail = async(option) => {
    // const transporter = nodemailer.createTransport(
    //     {
    //         host: process.env.EMAIL_HOST,
    //         port: process.env.EMAIL_PORT,
    //         auth: {
    //             user: process.env.EMAIL_USER,
    //             pasww: process.env.EMAIL_PASSWORD,
    //         }
    //     }
    // )

    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "e4fb6d269ae064",
          pass: "831f09bc5d226f"
        }
      });

    const emailOptions = {
        from: "digitalschool support <support@digitalschool.com>",
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    // const emailOptions = {
    //     from: "Cineflix support <support@cineflix.com>",
    //     to: option.email,
    //     subject: option.subject,
    //     test: option.message
    // }


    await transporter.sendMail(emailOptions)
}

module.exports = sendEmail;