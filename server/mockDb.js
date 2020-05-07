const Rental = require('./models/rental');
const User = require('./models/user');
const Booking = require('./models/booking');
const {logger} = require('./services/logger')

const mockDbData = require('./data.json');

class MockDb {
    constructor(){
        this.rentals = mockDbData.rentals;
        this.users = mockDbData.users;
    }

    populateDb(){
        logger.info('Populating database...');
        const owner = new User(this.users[0]);
        this.rentals.forEach((rental) => {
            const newRental = new Rental(rental);
            newRental.user = owner;
            owner.rentals.push(newRental);
            newRental.save();
        })
        owner.save();

        const user = new User(this.users[1]);
        user.save();
        logger.info('Populated database');
    }

    async cleanDb(){
        logger.info('Cleaning database...');
        await Rental.remove();
        await User.remove();
        await Booking.remove();
        logger.info('Cleaned database');
    }

    async seedDb(){
        await this.cleanDb();
        this.populateDb();
    }
}

module.exports = MockDb;