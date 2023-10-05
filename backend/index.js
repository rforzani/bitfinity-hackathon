import express from "express";
import cors from "cors";
import { domain } from "./config.js";
import { getDB } from "./database/mongodbManager.js";

const app = express();

const port = 8080;

app.use(express.json());
app.use(cors({ origin: domain, credentials: true }));

app.get("/loginInformation", async (req, res) => {
    const db = getDB();
    res.json({isLoggedIn: false, isBusiness: false});
});

app.post("/signup", async (req, res) => {
    if (req.body.username && req.body.firstName && req.body.password && req.body.lastName && req.body.accountType && req.body.wallet) {
        const db = await  getDB();
        let isPresent = await db.collection("users").findOne({ $or: [ { username: req.body.username }, { wallet: req.body.wallet } ] });
        if (!isPresent) {   
            await db.collection("users").insertOne({
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                type: req.body.accountType,
                wallet: req.body.wallet,
            });
            res.status(200).json({message: "User created successfully!"});
        } else {
            res.status(400).json({message: "Username or wallet address already exists!"});
        }
    } else {
        res.status(400).json({message: "Please complete all fields!"});
    }
});

app.post("/login", async (req, res) => {

});

app.listen(port, () => {console.log(`Server listening on port ${port}`)});