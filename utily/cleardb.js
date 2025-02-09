require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function clearDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("messages");
        const collection = database.collection("messages");

        // Delete all messages from the collection
        const result = await collection.deleteMany({});
        console.log(`Deleted ${result.deletedCount} messages from MongoDB`);
    } catch (error) {
        console.error("Error clearing database:", error);
    } finally {
        await client.close();
    }
}

clearDatabase();
