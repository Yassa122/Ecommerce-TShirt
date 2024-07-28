"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSessionID = void 0;
const uuid_1 = require("uuid");
const generateSessionID = (req, res, next) => {
    let sessionID = req.cookies.sessionID;
    if (!sessionID) {
        sessionID = (0, uuid_1.v4)();
        res.cookie('sessionID', sessionID, { httpOnly: true });
    }
    req.sessionID = sessionID;
    next();
};
exports.generateSessionID = generateSessionID;
