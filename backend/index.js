import express from "express";
import cors from "cors";
import { domain, jwtKey, jwtExpirySeconds, cookieDomain } from "./config.js";
import { getDB } from "./database/mongodbManager.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { hasBusinessAuthorization, hasStandardAuthorization } from "./middleware/middleware.js";
import { ObjectId } from "mongodb";

const app = express();

const port = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: domain, credentials: true }));

app.get("/loginInformation", async (req, res) => {
    let token = req.cookies.loginToken;
    if (token) {
        let payload = jwt.verify(token, jwtKey);
        if (payload && payload.user) {
            res.json({isLoggedIn: true, isBusiness: payload.user.type === "freelancer" ? false : true, user: payload.user});
        } else {
            res.json({isLoggedIn: false, isBusiness: false});
        }
    } else {
        res.json({isLoggedIn: false, isBusiness: false});
    }
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

app.post("/standardLogin", async (req, res) => {
    if (req.body.username && req.body.password) {
        const db = await getDB();
        let valid = await db.collection("users").findOne({ username: req.body.username, password: req.body.password });
        if (valid) {
            let tokenId = crypto.randomBytes(64).toString("hex");
            const token = jwt.sign({ user: { username: valid.username, type: valid.type, wallet: valid.wallet, id: valid._id }, tokenId: tokenId }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds,
            });
            res.cookie("loginToken", token, { maxAge: jwtExpirySeconds * 1000, httpOnly: true, secure: true, domain: cookieDomain, sameSite: "lax"});
            res.status(200).json({message: "Login successful!"});
        } else {
            res.status(400).json({message: "Incorrect username or password!"});
        }
    } else {
        res.status(400).json({message: "Please complete all fields!"});
    }
});

app.post("/pickWinner", hasBusinessAuthorization, async (req, res) => {
    if (req.body.winner && req.body.challenge) {
        const db = await getDB();
        await db.collection("projects").updateOne({_id: new ObjectId(req.body.challenge)}, {$set: {winner: req.body.winner, open: false}});
        res.json({message: "Winner selected successfully!"});
    }
});

app.post("/createProject", hasBusinessAuthorization, async (req, res) => {
    if (req.body.title && req.body.shortDescription && req.body.longDescription && req.body.deadline && req.body.reward && req.body.challengers && req.body.index) {
        try {   
            const db = await getDB();
            await db.collection("projects").insertOne({
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                longDescription: req.body.longDescription,
                deadline: new Date(req.body.deadline),
                reward: req.body.reward,
                challengers: Number(req.body.challengers),
                business: new ObjectId(req.user.id),
                participants: 0,
                index: Number(req.body.index),
                open: true
            });
            res.json({message: "Project created successfully!"});
        } catch (err) {
            res.status(400).json({message: "Error creating project!"});
        }
    } else {
        res.status(400).json({message: "Please complete all fields!"});
    }
});

app.post("/submit", hasStandardAuthorization, async (req, res) => {
    if (req.body.link && req.body.competitionId) {
        const db = await getDB();
        await db.collection("submissions").insertOne({projectId: new ObjectId(req.body.competitionId), link: req.body.link, participant: new ObjectId(req.user.id), address: req.user.wallet});
        await db.collection("projects").updateOne({_id: new ObjectId(req.body.competitionId)}, {$inc: {participants: 1}});
        res.json({message: "Submission successful!"});
    }
});

app.post("/getSubmissions", hasStandardAuthorization, async (req, res) => {
    const db = await getDB();
    let submissions = await db.collection("submissions").find({projectId: new ObjectId(req.body.challenge)}).toArray();
    res.json({submissions: submissions});
});

app.get("/getCompetitions", hasStandardAuthorization, async (req, res) => {
    const db = await getDB();
    let competitions = await db.collection("projects").find({$expr: {$lt: ["$participants", "$challengers"]}, open: true}).toArray();
    res.json({competitions: competitions});
});

app.get("/getAllCompetitions", hasStandardAuthorization, async (req, res) => {
    const db = await getDB();
    let competitions = await db.collection("projects").find({$expr: {$lt: ["$participants", "$challengers"]}}).toArray();
    res.json({competitions: competitions});
});

app.listen(port, () => {console.log(`Server listening on port ${port}`)});