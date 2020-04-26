const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const saltRounds = 10;

const userSchema = new Schema({
    username: { 
        type: String, 
        min: [4, 'Too short, max is 4 characters'], 
        max: [32, 'Too long, max is 32 characters']
    },
    email: { 
        type: String, 
        max: [128, 'Too long, max is 128 characters'],
        unique: true,
        lowercase: true,
        required: 'Email is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        min: [8, 'Too short, min is 8 characters'],
        max: [128, 'Too long, max is 128 characters'],
        required: 'Password is required'
    },
    rentals: [{type: Schema.Types.ObjectId, ref: 'Rental'}],
    createdAt: { type: Date, default: Date.now }
});

userSchema.methods.isSamePassword = function(requestedPassword) {
    return bcrypt.compareSync(requestedPassword, this.password);
}

userSchema.pre('save', function(next) {
    const user = this;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
})

module.exports = mongoose.model('User', userSchema);