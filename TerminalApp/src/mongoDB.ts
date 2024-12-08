import { MongoClient, Collection } from "mongodb";
import dotenv from "dotenv";
import data from './data/data.json';
import { User } from "./models/interfaces";

dotenv.config();

export const uri = process.env.URI || "mongodb+srv://s115225:azerty123@terminalapp.5njae.mongodb.net/?retryWrites=true&w=majority&appName=TerminalApp";
export const client = new MongoClient(uri);

const collectionUsers: Collection<User> = client.db("budgetApp").collection<User>("expenses");

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    try {
        await client.connect();
        await insertData();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}

async function insertData() {
    const db = client.db('budgetApp');
    const collection = db.collection('expenses');

    try {
        const existingData = await collection.find({}).limit(1).toArray();

        if (existingData.length === 0) {
            const result = await collection.insertOne(data[0]);
            console.log(`Data successfulled added in database...`);
        } else {
            console.log("Data already exists in the 'expenses' collection.");
        }
    } catch (error) {
        console.error("Error inserting data:", error);
    }
}
