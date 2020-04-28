const User = require('../models/user');
const mongooseHelpers = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/config.development');
const LocalizationResources = require('../localization/resources')

exports.auth = (req, res) => {
    const {email, password} = req.body;

    if(!password || !email){
        return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_RegistrationError_Title, 
            detail: LocalizationResources.Controllers_User_RegistrationError_Detail}]});
    }

    User.findOne({email: email}, (err, user) =>{
        if (err){
            return res.status(422).send({errors: mongooseHelpers.normalizeErrors(err.errors)});
        }

        if(!user) {
            return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_Auth_InexistingUser_Title, 
                detail: LocalizationResources.Controllers_User_Auth_InexistingUser_Detail}]});
        }

        if (user.isSamePassword(password)){
            const token = jwt.sign({
                userId: user.id,
                username: user.username,
            }, config.SECRET, { expiresIn: '1h' });
            return res.json(token);
        }
        else {
            return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_Auth_InvalidData_Title, 
                detail: LocalizationResources.Controllers_User_Auth_InvalidData_Detail}]});
        }
    })
}

exports.register = (req, res) => {
    const {
        username,
        email,
        password,
        passwordConfirmation
    } = req.body;

    if(!password || !email){
        return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_RegistrationError_Title, 
            detail: LocalizationResources.Controllers_User_RegistrationError_Detail}]});
    }

    if(password !== passwordConfirmation){
        return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_RegistrationError_UnmatchedPasswords_Title, 
            detail: LocalizationResources.Controllers_User_RegistrationError_UnmatchedPasswords_Detail}]});
    }

    User.findOne({email: email}, (err, existingUser) =>{
        if (err){
            return res.status(422).send({errors: mongooseHelpers.normalizeErrors(err.errors)});
        }

        if(existingUser) {
            return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_RegistrationError_UserWithEmailExists_Title, 
                detail: LocalizationResources.Controllers_User_RegistrationError_UserWithEmailExists_Detail}]});
        }

        const user = new User({
            username,
            email,
            password
        });

        user.save((err) => {
            if (err){
                return res.status(422).send({errors: mongooseHelpers.normalizeErrors(err.errors)});
            }
            return res.json({'registered': true});
        });
    });
}

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if(!token) {
        return unauthorized(res);
    }
    else {
        const user = parseToken(token);
        User.findById(user.userId, (err, user) => {
            if (err){
                return res.status(422).send({errors: mongooseHelpers.normalizeErrors(err.errors)});
            }

            if (user){
                res.locals.user = user;
                next();
            }
            else {
                return unauthorized(res);
            }
        });
    }
}

const parseToken = (token) => {
    return jwt.verify(token.split(' ')[1], config.SECRET);
}

const unauthorized = (res) => {
    return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_Unauthorized_Title, 
        detail: LocalizationResources.Controllers_User_Unauthorized_Detail}]});
}