const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config.development');
const MockDb = require('./mockDb');

const rentalRoutes = require('./routes/rentals');

mongoose.connect(
    config.DB_CONNECTION_STRING, 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
).then(() => {
    //const mockDb = new MockDb();
    //mockDb.seedDb();
});

const app = express();

app.use('/api/rentals/', rentalRoutes);

const PORT = process.env.PORT || 3001
app.listen(PORT, function(){
    console.log("Server running on port " + PORT)
});