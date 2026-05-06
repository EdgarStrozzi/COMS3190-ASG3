const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 8080;
const host = "localhost";

//! MongoDb
const { MongoClient } = require("mongodb");

//! Constants
const url = "mongodb://127.0.0.1:27017";
const dbName = "aethera_airways";
const client = new MongoClient(url);

const db = client.db(dbName);
let usersCollection;
let flightsCollection;
let bookingsCollection;

//! Helper
async function generateConfirmationNumber() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    while (true) {
        let confirmationNumber = "";

        for (let i = 0; i < 6; i++) {
            confirmationNumber += chars.charAt(
                Math.floor(Math.random() * chars.length)
            );
        }

        const existingBooking = await bookingsCollection.findOne({
            confirmationNumber: confirmationNumber,
        });

        if (!existingBooking) {
            return confirmationNumber;
        }
    }
}

//! Test for connection 
async function connectToMongo() {
    try {
        await client.connect();
        
        usersCollection = db.collection("Users");
        flightsCollection = db.collection("Flights");
        bookingsCollection = db.collection("Bookings");

        await bookingsCollection.createIndex({ confirmationNumber: 1 }, { unique: true });
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        
        console.log("Connected to MongoDB database:", dbName);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

app.get("/", (req, res) => {
    res.send("Welcome to Aethera Airways API");
});

//* MARK: GET(all) Flight
app.get("/flights", async (req, res) => {
    try {
        const { origin, destination, date } = req.query;

        const query = {};

        if (origin) {
            query.origin = origin.toUpperCase().trim();
        }

        if (destination) {
            query.destination = destination.toUpperCase().trim();
        }

        if (date) {
            query.departureTime = { $regex: `^${date}` };
        }

        const results = await flightsCollection.find(query).toArray();

        res.status(200).send(results);
    } catch (error) {
        console.error("Could not list flights:", error);
        res.status(500).send({
            message: "Error listing flights.",
        });
    }
});

//* MARK: GET(id) Flight
app.get("/flights/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        
        if (Number.isNaN(id)) {
            return res.status(400).send({
                message: "Invalid flight ID.",
            });
        }
        
        const query = { id: id };
        const result = await flightsCollection.findOne(query);
        
        if (!result) {
            return res.status(404).send({
                message: "Flight not found.",
            });
        }
        
        res.status(200).send(result);
    } catch (error) {
        console.error("Error getting flight:", error);
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});

//* MARK: GET(id) Booking
app.get("/bookings/confirmation/:confirmationNumber", async (req, res) => {
    try {
        const confirmationNumber = req.params.confirmationNumber.toUpperCase().trim();
        const lastName = req.query.lastName;

        if (!confirmationNumber || !lastName) {
            return res.status(400).send({
                message: "Confirmation number and last name are required.",
            });
        }

        const booking = await bookingsCollection.findOne({
            confirmationNumber: confirmationNumber,
        });

        if (!booking) {
            return res.status(404).send({
                message: "Booking not found.",
            });
        }

        const passengerMatch = booking.passengers.some((passenger) => {
            return (
                passenger.lastName &&
                passenger.lastName.toLowerCase() === lastName.toLowerCase().trim()
            );
        });

        if (!passengerMatch) {
            return res.status(404).send({
                message: "Booking not found for that confirmation number and last name.",
            });
        }

        res.status(200).send(booking);
    } catch (error) {
        console.error("Error looking up booking:", error);
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});

//* MARK: POST booking
app.post("/bookings", async (req, res) => {
    try {
        const { userId, flightId, passengers, seatsBooked, totalAmount } = req.body;

        if (!flightId || !passengers || !seatsBooked || !totalAmount) {
            return res.status(400).send({
                message: "Missing required booking information.",
            });
        }

        if (!Array.isArray(passengers) || passengers.length === 0) {
            return res.status(400).send({
                message: "At least one passenger is required.",
            });
        }

        const flight = await flightsCollection.findOne({
            id: Number(flightId),
        });

        if (!flight) {
            return res.status(404).send({
                message: "Flight not found.",
            });
        }

        for (const seatClass in seatsBooked) {
            const requestedSeats = Number(seatsBooked[seatClass]);

            if (Number.isNaN(requestedSeats) || requestedSeats <= 0) {
                return res.status(400).send({
                    message: "Seat count must be greater than 0.",
                });
            }

            if (!flight.seats[seatClass]) {
                return res.status(400).send({
                    message: `Invalid seat class: ${seatClass}`,
                });
            }

            if (requestedSeats > flight.seats[seatClass].available) {
                return res.status(400).send({
                    message: `Not enough seats available in ${seatClass}.`,
                });
            }
        }

        const confirmationNumber = await generateConfirmationNumber();

        const newBooking = {
            userId: userId || null,
            flightId: Number(flightId),
            passengers: passengers,
            seatsBooked: seatsBooked,
            totalAmount: Number(totalAmount),
            confirmationNumber: confirmationNumber,
            createdAt: new Date(),
        };

        const bookingResult = await bookingsCollection.insertOne(newBooking);

        const seatUpdates = {};

        for (const seatClass in seatsBooked) {
            seatUpdates[`seats.${seatClass}.available`] =
                -Number(seatsBooked[seatClass]);
        }

        await flightsCollection.updateOne(
            { id: Number(flightId) },
            { $inc: seatUpdates }
        );

        res.status(201).send({
            message: "Booking created successfully.",
            bookingId: bookingResult.insertedId,
            confirmationNumber: confirmationNumber,
            booking: newBooking,
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});

//* MARK: POST SignUp
app.post("/auth/signup", async (req, res) => {
    try {
        //! Check User Fields
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).send({
                message: "Name, email, and password are required.",
            });
        }
        
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await usersCollection.findOne({
            email: normalizedEmail,});
            
            if (existingUser) {
                return res.status(409).send({
                    message: "An account with this email already exists.",
                });
            }
            
            const newUser = {
                name: name.trim(),
                email: normalizedEmail,
                password: password,
                createdAt: new Date(),
            };
            
            //! If all fields are valid -> POST
            const result = await usersCollection.insertOne(newUser);
            res.status(201).send({
                message: "User account created successfully.",
                user: {
                    _id: result.insertedId,
                    name: newUser.name,
                    email: newUser.email,
                },
            });
            
        } catch (error) {
            console.error("Signup error:", error);
            res.status(500).send({
                message: "Server error during signup.",
            });
        }
    });
    
//* MARK: POST Login
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password are required.",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await usersCollection.findOne({
            email: normalizedEmail,
        });

        if (!user || user.password !== password) {
            return res.status(401).send({
                message: "Invalid email or password.",
            });
        }

        res.status(200).send({
            message: "Login successful.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({
            message: "Server error during login.",
        });
    }
});

    connectToMongo().then(() => {
        app.listen(port, () => {
            console.log(`App listening at http://${host}:${port}`);
        });
    });