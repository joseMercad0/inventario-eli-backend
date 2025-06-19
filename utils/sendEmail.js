const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    //Create email transporter
   const transporter = nodemailer.createTransport({
     host: process.env.EMAIL_HOST,         // smtp.gmail.com
    port: parseInt(process.env.EMAIL_PORT), // 465
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
   });
   // Option for sending email
   const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
    headers: {
    'X-Priority': '1',
    'X-MSMail-Priority': 'High',
    'Importance': 'high'
     }
   };
   //send email
   transporter.sendMail(options, function (err, info) {
    if (err) {
        console.log(err);
    }else{
        console.log(info);
    }
    
   });
};

module.exports = sendEmail;