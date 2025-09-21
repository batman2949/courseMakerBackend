const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const allowedOrigins = [
    "http://localhost:3000",              // local dev
    "https://course-maker-mu.vercel.app"  // your deployed frontend
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


app.use(express.json());

app.use("/gemini",require("./route/geminiAPI"));



const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("Connected to PORT",PORT);
} )