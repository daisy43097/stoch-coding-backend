require('dotenv').config();
import express from "express"
import bodyParser from "body-parser";
import routes from "./routes";
import cors from 'cors';
import mongoose from "mongoose";
const { MongoMemoryServer } = require('mongodb-memory-server');

const SERVER_PORT = process.env.SERVER_PORT;

// MongoDB in-memory server
async function startServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Create and start the MongoDB in-memory server
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    try {
        await mongoose.connect(uri);
        console.log(`MongoDB server is connected on ${uri}`);
    } catch (error) {
        console.error('Error in connecting with MongoDB: ', error);
        return;
    }

    app.use('/', routes);

    app.listen(SERVER_PORT, () => {
        console.log(`Server listening at http://localhost:${SERVER_PORT}`);
    });
}

startServer().catch(error => {
    console.error('Failed to start server:', error);
});
