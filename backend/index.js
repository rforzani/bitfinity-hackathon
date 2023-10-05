import express from "express";
import cors from "cors";
import { domain, jwtKey, jwtExpirySeconds, cookieDomain } from "./config.js";
import { getDB } from "./database/mongodbManager.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

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
            console.log(payload);
            res.json({isLoggedIn: true, isBusiness: payload.user.type === "freelancer" ? false : true});
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
            const token = jwt.sign({ user: { username: valid.username, type: valid.type, wallet: valid.wallet }, tokenId: tokenId }, jwtKey, {
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

app.listen(port, () => {console.log(`Server listening on port ${port}`)});