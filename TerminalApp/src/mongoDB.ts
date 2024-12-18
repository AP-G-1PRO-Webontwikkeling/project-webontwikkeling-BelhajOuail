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
        }
    } catch (error) {
        console.error("Error inserting data:", error);
    }
}


export async function getUser(userId: string) {
    const user = await collectionUsers.findOne({ id: userId });
    return user;
}


export async function getUserAndTransactions(userId: string) {
    const user = await collectionUsers.findOne({ id: userId });

    if (!user) {
        throw new Error(`User with id ${userId} not found`);
    }

    const transactions = user.expenses;

    return { user, transactions };
}

export async function filterTransactions(transactions: any[], type?: string, search?: string) {
    let filteredTransactions = transactions;

    if (type) {
        filteredTransactions = filteredTransactions.filter((transaction) =>
            type === 'incoming' ? transaction.isIncoming : !transaction.isIncoming
        );
    }

    if (search && !isNaN(Number(search))) {
        const searchAmount = Number(search);
        filteredTransactions = filteredTransactions.filter((transaction) =>
            transaction.amount === searchAmount
        );
    }
    return filteredTransactions;
}

export async function addTransactionToUser(userId: string, newTransaction: any) {
    const user = await collectionUsers.findOne({ id: userId });

    if (user) {
        const newTransactionId = (user.expenses.length + 1).toString();

        newTransaction.id = newTransactionId;

        await collectionUsers.updateOne(
            { id: userId },
            { $push: { expenses: newTransaction } }
        );
    }
}

export async function removeTransactionFromUser(userId: string, transactionId: string) {
    const user = await collectionUsers.findOne({ id: userId });

    if (user) {
        await collectionUsers.updateOne(
            { id: userId },
            { $pull: { expenses: { id: transactionId } } }
        );
    }
}

export async function updateTransactionForUser(userId: string, transactionId: string, updatedTransaction: any) {
    const user = await collectionUsers.findOne({ id: userId });

    if (user) {
        const transactionIndex = user.expenses.findIndex((t) => t.id === transactionId);

        if (transactionIndex !== -1) {
            user.expenses[transactionIndex] = { ...user.expenses[transactionIndex], ...updatedTransaction };

            await collectionUsers.updateOne(
                { id: userId },
                { $set: { expenses: user.expenses } }
            );
        }
    }
}









