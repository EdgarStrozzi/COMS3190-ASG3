var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = "8080";
const host = "localhost";
//Add MongoDB
const { MongoClient } = require("mongodb");
//Add Constants
const url = "mongodb://127.0.0.1:27017";
const dbName = "aethera_airways";
const client = new MongoClient(url);
const db = client.db(dbName);
const collection = "flights";
app.listen(port, () => {
    console.log("App listening at http://%s:%s",
    host, port);
});
app.get("/", async (req, res) => {
    res.send("welcom to aethera")
})
app.get("/listFlights", async (req, res) => {
    await client.connect();
    const query ={};
    const results = await db
    .collection(collection)
    .find(query)
    .limit(10)
    .toArray();
    
    res.status(200).send(results);
}
)
app.post("/loginUser", async (req, res) => {
    try {
        await client.connect();
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        //check for new user
        const users = db.collection("users");
        const existing = await users.findOne({ email: req.body.email });
        console.log(existing);

        if (existing) {
            //console.log(existing);
            console.log("form:" + req.body.username + "existing:" + existing.name);
            if(existing.name == req.body.username && req.body.password == existing.password){
                return res.status(409).json({
                    message: "logging in",
                    user: existing
                });
            } else {
                return res.status(401).json({ message: "Incorrect name or password" });;
            }
        }
        return res.status(404).json({
            message: "User does not exist"
        });
    } catch (error) {
        console.error("Could not login" + error);
        res.status(500);
        res.send("Error logging in");
    } finally {
        await client.close();
    }
}
);
app.post("/addUser", async (req, res) => {
    try {
        await client.connect();
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        //check for new user
        const users = db.collection("users");
        const existing = await users.findOne({ email: req.body.email });
        console.log(existing);

        if (existing) {
            console.log(existing);
            if(existing.name === req.body.name && req.body.password === existing.password){
                return res.status(409).json({
                    message: "logging in",
                    user: existing
                });
            } else {
                return res.status(401).json({ message: "Incorrect name or password" });;
            }
        }

        const newDocument = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        };
        console.log(newDocument);
        const result = await db.collection("users").insertOne(newDocument);
        res.status(200);
        res.send(result);
    } catch (error) {
        console.error("Could not add the new Robot" + error);
        res.status(500);
        res.send("Error adding new robot");
    } finally {
        await client.close();
    }
});