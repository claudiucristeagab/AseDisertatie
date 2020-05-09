const jwt = require('jsonwebtoken');
const mongooseHelper = require('../helpers/mongoose');
const UserModel = require('../models/user');
const Config = require('../config/config.development');
const LocalizationResources = require('../localization/resources')
const {logger} = require('../services/logger')

exports.auth = (req, res) => {
    const {email, password} = req.body;

    if(!password || !email){
        return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_RegistrationError_Title, 
            detail: LocalizationResources.Controllers_User_RegistrationError_Detail}]});
    }

    UserModel.findOne({email: email}, (err, user) =>{
        if (err){
            return res.status(422).send({errors: mongooseHelper.normalizeErrors(err.errors)});
        }

        if(!user) {
            return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_Auth_InexistingUser_Title, 
                detail: LocalizationResources.Controllers_User_Auth_InexistingUser_Detail}]});
        }

        if (user.isSamePassword(password)){
            const token = jwt.sign({
                userId: user.id,
                username: user.username,
            }, Config.SECRET, { expiresIn: '1h' });
            logger.info(`UserController - User with id '${user.id}', username: '${user.username}' logged in`);
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

    UserModel.findOne({email: email}, (err, existingUser) =>{
        if (err){
            return res.status(422).send({errors: mongooseHelper.normalizeErrors(err.errors)});
        }

        if(existingUser) {
            return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_RegistrationError_UserWithEmailExists_Title, 
                detail: LocalizationResources.Controllers_User_RegistrationError_UserWithEmailExists_Detail}]});
        }

        const user = new UserModel({
            username,
            email,
            password
        });

        user.save((err) => {
            if (err){
                return res.status(422).send({errors: mongooseHelper.normalizeErrors(err.errors)});
            }
            logger.info(`UserController - User with id '${user.id}', username: '${user.username}' has registered.`);
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
        UserModel.findById(user.userId, (err, user) => {
            if (err){
                return res.status(422).send({errors: mongooseHelper.normalizeErrors(err.errors)});
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
    return jwt.verify(token.split(' ')[1], Config.SECRET);
}

const unauthorized = (res) => {
    return res.status(422).send({errors: [{title: LocalizationResources.Controllers_User_Unauthorized_Title, 
        detail: LocalizationResources.Controllers_User_Unauthorized_Detail}]});
}