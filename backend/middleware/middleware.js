import jwt from "jsonwebtoken";
import { jwtKey } from "../config.js";

export const hasBusinessAuthorization = async function (req, res, next) {
    if (req.cookies && req.cookies.loginToken) {
        let payload = jwt.verify(req.cookies.loginToken, jwtKey);
        if (payload) {
            if (payload.user.type === "business") {
                req.user = {id: payload.user.id, wallet: payload.user.wallet};
                next();
            } else {
                res.status(400).json({type: "failure", message: "User is not a business account."});    
            }
        } else {
            res.status(400).json({type: "failure", message: "Invalid login token."});    
        }
    } else {
        res.status(400).json({type: "failure", message: "Invalid login token."});
    }
}

export const hasStandardAuthorization = async function (req, res, next) {
    if (req.cookies && req.cookies.loginToken) {
        let payload = jwt.verify(req.cookies.loginToken, jwtKey);
        if (payload) {
            req.user = {id: payload.user.id, wallet: payload.user.wallet};
            next();
        } else {
            res.status(400).json({type: "failure", message: "Invalid login token."});    
        }
    } else {
        res.status(400).json({type: "failure", message: "Invalid login token."});
    }
}