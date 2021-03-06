const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
    title: { type: String, required: true, max: [128, 'Too long, max is 128 characters']},
    city: { type: String, required: true },
    country: { type: String, required: true },
    street: { type: String, required: true, min: [4, 'Too short, min is 4 characters']},
    address: { type: String },
    category: { type: String, required: true, lowercase: true },
    image: { type: String, required: true },
    bedrooms: Number,
    beds: Number,
    guests: Number,
    description: { type: String, required: true },
    dailyRate: Number,
    createdAt: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review'}]
});
rentalSchema.index(
    {
        country: 'text', city: 'text', street: 'text', address: 'text', title: 'text'
    }
);

module.exports = mongoose.model('Rental', rentalSchema);