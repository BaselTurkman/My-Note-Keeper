require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express")
const noteRouter = require("./routes/noteRoutes")
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express()

app.use(cors())
app.use(bodyParser.json())


async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB successfully");
        app.listen(8000, () => {
            console.log("Server running on port 8000");
        })
    } catch (error) {
        console.error("DB connection error:", error);
    }
}

connectDB();
