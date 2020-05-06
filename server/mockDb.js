const Rental = require('./models/rental');
const User = require('./models/user');
const Booking = require('./models/booking');

class MockDb {
    constructor(){
        this.rentals = [{
            title: "Nice view on ocean",
            country: "United States",
            city: "San Francisco",
            street: "Main street",
            address: "",
            category: "condo",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 4,
            shared: true,
            description: "Very nice apartment in center of the city.",
            dailyRate: 43
            },
            {
            title: "Apartment Greenfield",
            country: "Romania",
            city: "Bucharest",
            street: "Drumul Padurea Mogosoaia 38",
            address: "Flat TO38, Floor 2, Ap. 40",
            category: "apartment",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 1,
            shared: false,
            description: "Very nice apartment in center of the city.",
            dailyRate: 11
            },
            {
            title: "Old house in nature",
            country: "Slovakia",
            city: "Spisska Nova Ves",
            street: "Banicka 1",
            address: "",
            category: "house",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 5,
            shared: true,
            description: "Very nice apartment in center of the city.",
            dailyRate: 23
        }],

        this.users = [{
            username: "owner",
            email:"owner@email.com",
            password: "password"
        },
        {
            username: "user",
            email:"user@email.com",
            password: "password"
        }]
    }

    pushDataToDb(){
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
    }

    async cleanDb(){
        await Rental.remove();
        await User.remove();
        await Booking.remove();
    }

    async seedDb(){
        await this.cleanDb();
        this.pushDataToDb();
    }
}

module.exports = MockDb;