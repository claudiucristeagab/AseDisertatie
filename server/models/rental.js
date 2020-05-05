const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
    title: { type: String, required: true, max: [128, 'Too long, max is 128 characters']},
    city: { type: String, required: true, lowercase: true },
    country: { type: String, required: true },
    street: { type: String, required: true, min: [4, 'Too short, min is 4 characters']},
    address: { type: String },
    category: { type: String, required: true, lowercase: true },
    image: { type: String, required: true },
    bedrooms: Number,
    shared: Boolean,
    description: { type: String, required: true },
    dailyRate: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rental', rentalSchema);