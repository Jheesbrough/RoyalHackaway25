require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
const client = new Client();

const CHANNEL_ID = "1337849004125589566";
const MESSAGE_CONTENT = "Codebase has been updated.";

const { MongoClient } = require("mongodb");
const axios = require("axios");

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

client.on("messageCreate", async (message) => {
  if (
    message.channel.id === CHANNEL_ID &&
    message.content === MESSAGE_CONTENT
  ) {
    console.log("Received update notification: Code base has been updated.");

    try {
      await delay(3000);
      await message.react("👍");
      console.log("Reacted with thumbs up.");

      await message.channel.sendTyping();
      await delay(2000);
      await message.channel.send("LGTM");
      console.log("Sent message: LGTM");

      // Fetch a key and data from mongoDB and send it to the channel

      const uri = process.env.MONGO_URI;
      const client = new MongoClient(uri);

      await client.connect();
      console.log("Connected to MongoDB");

      const database = client.db("messages");
      const collection = database.collection("messages");

      // Grab the latest thing in the collection
      const query = {};
      const options = {
        sort: { _id: -1 },
      };
      const latestMessage = await collection.findOne(query, options);
      //   Delte the message from the database
      await collection.deleteOne(latestMessage);

      console.log("Fetched latest message from MongoDB");
      console.log(latestMessage);
      console.log("Sent data to the channel");
      await message.channel.send(
        "Found encrypted message: " + latestMessage.message
      );

      //   Send the message to a rest API

      const response = await axios.post(
        "https://hacksussex.j33.xyz/",
        {
            message: latestMessage.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      console.log("Sent data to the API");
      console.log(response.status);

      await client.close();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("An error occurred while processing the message:", error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
