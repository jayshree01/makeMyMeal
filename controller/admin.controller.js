const {
    json
} = require('body-parser');
const {
    validationResult
} = require('express-validator');
const Admin = require('../model/admin.model');

exports.signin = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({
            errors: errors.array()
        });
    Admin.findOne({
        email: request.body.email,
        password: request.body.password,
        name: request.body.name
    }).then(result => {
        if (result)
            return response.status(200).json(result);
        else
            return response.status(404).json({
                message: 'Invalid User'
            });
    }).catch(err => {
        return response.status(500).json({
            message: 'Oops! something went wrong'
        });
    });
}

exports.signup = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(403).json({
            errors: errors.array()
        });

    Admin.create({
        email: request.body.email,
        password: request.body.password,
        name: request.body.name
    }).then(result => {
        return response.status(201).json(result);
    }).catch(err => {
        return response.status(500).json({
            message: 'Oops! something went wrong'
        });
    });

}
exports.reset = (req, res) => {
    const errors = validationResult(req)
    Admin.findByName(req.body.name).then(function (sanitizedUser) {
        if (sanitizedUser) {
            sanitizedUser.setPassword(req.body.password, function () {
                sanitizedUser.save();
                req.flash("success", "password resetted");
                res.redirect("/signin");
            });
        } else {
            req.flash("error", "User doesnt exist");
            res.status(500).send('Some useful error message')
        }
    }, function (err) {
        console.log(err);
        res.redirect("/");
    });
}