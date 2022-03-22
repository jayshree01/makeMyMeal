var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    port: 465,               
    host: "smtp.gmail.com",
       auth: {
            user: 'jayu9399@gmail.com',
            pass: 'shree#1234',
         },
    secure: true,
    });
    module.exports=transporter;