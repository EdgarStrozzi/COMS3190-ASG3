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

//! Test for connection 
async function connectToMongo() {
    try {
        await client.connect();
        
        usersCollection = db.collection("Users");
        flightsCollection = db.collection("Flights");
        
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

//* MARK: GET(all)
app.get("/flights", async (req, res) => {
    try {
        const results = await flightsCollection.find({}).limit(10).toArray();
        res.status(200).send(results);
    } catch (error) {
        console.error("Could not list flights:", error);
        res.status(500).send({
            message: "Error listing flights.",
        });
    }
});

//* MARK: GET(id)
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

//* MARK: SignUp
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
    
    connectToMongo().then(() => {
        app.listen(port, () => {
            console.log(`App listening at http://${host}:${port}`);
        });
    });