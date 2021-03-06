const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require('./config/config.development');
const { expressLogger, expressErrorLogger } = require('./services/logger')
const MockDb = require('./mockDb');

const rentalRoutes = require('./routes/rentals'),
    userRoutes = require('./routes/users'),
    bookingRoutes = require('./routes/bookings'),
    reviewRoutes = require('./routes/reviews'),
    imageRoutes = require('./routes/images'),
    paymentRoutes = require('./routes/payments');

mongoose.connect(
    config.DB_CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    // const mockDb = new MockDb();
    // mockDb.seedDb();
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(expressLogger);

app.use('/api/rentals/', rentalRoutes);
app.use('/api/users/', userRoutes);
app.use('/api/bookings/', bookingRoutes);
app.use('/api/reviews/', reviewRoutes);
app.use('/api/images/', imageRoutes);
app.use('/api/payments/', paymentRoutes);

app.use(expressErrorLogger);

const PORT = process.env.PORT || 3001
app.listen(PORT, function () {
    console.log("Server running on port " + PORT)
});