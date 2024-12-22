import dotenv from "dotenv";
import session from "express-session";
import { User } from "../models/interfaces";
import mongoDbSession from "connect-mongodb-session";
const MongoDBStore = mongoDbSession(session);

dotenv.config();

const mongoStore = new MongoDBStore({
    uri: process.env.URI || "mongodb+srv://s115225:azerty123@terminalapp.5njae.mongodb.net/?retryWrites=true&w=majority&appName=TerminalApp",
    collection: "sessions",
    databaseName: "login-express",
});

declare module 'express-session' {
    export interface SessionData {
        user?: User;
    }
}

export default session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: mongoStore, 
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
    }
});
