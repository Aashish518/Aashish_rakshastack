// Initialize express app
const express = require("express");
const app = express();

// environment variables
require("dotenv").config()

// Connect to database
const connectDB = require("./databases/db");
connectDB();

// Import user routes
const userRoutes = require("./routes/auth");
const pgRoutes = require("./routes/pg");

// Middleware to parse JSON
const cors = require("cors");

app.use(cors({
    origin: process.env.FRONT_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the router
app.use("/api", userRoutes);
app.use("/api", pgRoutes);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
