const {
    request,
    response
} = require("express");
const Customer = require('../model/customer.model');
const transporter = require('../mail/mail');

const client = require('twilio')('ACdffb5f370bd2ad46033512651c3eb647', 'e704c69ec68c69de6c202f857aa793b0');

exports.sendOtp = (request, response, next) => {
    const email = request.params.email;
    const mobile = "+91" + request.params.number

    request.session.otp = Math.floor((Math.random() * 10000) + 1);
    const message = "hello " + request.params.name + " Your One Time Password is :-" + request.session.otp;
    const mailData = {
        from: 'jayu9399@gmail.com',
        to: email,
        subject: "EMAIL VERIFICATION",
        text: message

    };

    function sendTextMessage() {
        client.messages.create({
                body: message,
                to: mobile * 1,
                from: +17753837930

            })
            .then(() => {
                console.log("message Send")
            })
            .catch(err => {
                console.log(err)
            })
    };

    sendTextMessage();

    transporter.sendMail(mailData, function (err, info) {
        if (err) {
            console.log(err)
            return response.status(500).json({
                message: "error"
            });

        } else
            return response.status(200).json({
                message: "sucesss"
            })
    });


};
exports.ragistrationByOtp = (request, response, next) => {
    if (request.session.otp == request.body.otp) {
        const customer = new Customer();
        customer.customerName = request.body.customerName;
        customer.customerEmail = request.body.customerEmail;
        customer.customerNumber = request.body.customerNumber;
        customer.customerPassword = request.body.customerPassword;
        customer.save()
            .then(result => {
                return response.status(201).json(result);
            })
            .catch(err => {
                return response.status(500).json(err)
            });


    } else {
        return response.status(404).json({
            message: "Otp Not Correct"
        });
    }
};
exports.customerSignIn = (request, response, next) => {
    Customer.findOne({
            customerEmail: request.body.customerEmail,
            customerPassword: request.body.customerPassword
        })
        .then(result => {
            if (result)
                return response.status(302).json(result);
            else
                return response.status(404).json({
                    message: "User not found"
                })
        })
        .catch(err => {
            console.log(err)
            return response.status(500).json({
                message: "Oops Something Went Wrong"
            });
        })
};