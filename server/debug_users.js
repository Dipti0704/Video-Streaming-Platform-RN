const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();
const connectDB = require("./config/connect");

const debugUsers = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Connected to DB");

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        users.forEach((u) => {
            console.log("--------------------------------");
            console.log(`ID: ${u._id}`);
            console.log(`Email: ${u.email}`);
            console.log(`Username: ${u.username}`);
            console.log(`Name: ${u.name}`);
            console.log(`Password (exists?): ${!!u.password}`);
            if (u.password) {
                console.log(`Password (length): ${u.password.length}`);
                console.log(`Password (starts with $2?): ${u.password.startsWith('$2')}`); // Check if it looks like a bcrypt hash
            }
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugUsers();
