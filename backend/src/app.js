const authenticateApiKey = require("./helpers/middleware.js");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const router = require("./routes/index.js");
const app = express();

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ["http://localhost:8080"];
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-API-Key"],
};

// Middleware
app.use(express.static("public"));
app.use(logger(app.get("env") === "development" ? "dev" : "short"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(authenticateApiKey);

// Routes
app.use("/pokemon", router);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

// Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

module.exports = app;
