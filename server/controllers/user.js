const User = require('../models/user');
const mongooseHelpers = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/config.development');

exports.auth = (req, res) => {
    const {email, password} = req.body;

    if(!password || !email){
        return res.status(422).send({errors: [{title: 'User registration error', detail: 'Email or password missing.'}]});
    }

    User.findOne({email: email}, (err, user) =>{
        if (err){
            return res.status(422).send({errors: mongooseHelpers.normalizeErrors(err.errors)});
        }

        if(!user) {
            return res.status(422).send({errors: [{title: 'Invalid user', detail: 'User does not exist.'}]});
        }

        if (user.isSamePassword(password)){
            const token = jwt.sign({
                userId: user.id,
                username: user.username,
            }, config.SECRET, { expiresIn: '1h' });
            return res.json(token);
        }
        else {
            return res.status(422).send({errors: [{title: 'Invalid data', detail: 'Email/password is incorrect.'}]});
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
        return res.status(422).send({errors: [{title: 'User registration error', detail: 'Email or password missing.'}]});
    }

    if(password !== passwordConfirmation){
        return res.status(422).send({errors: [{title: 'User registration error', detail: 'Passwords do not match.'}]});
    }

    User.findOne({email: email}, (err, existingUser) =>{
        if (err){
            return res.status(422).send({errors: mongooseHelpers.normalizeErrors(err.errors)});
        }

        if(existingUser) {
            return res.status(422).send({errors: [{title: 'User registration error', detail: 'User with this email already exists.'}]});
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
    return res.status(422).send({errors: [{title: 'Unauthorized', detail: 'Login required.'}]});
}