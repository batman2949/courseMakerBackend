const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors({
     origin: ["http://localhost:3000", "https://j6htdvmr-3000.inc1.devtunnels.ms",  process.env.FRONTEND_URL],
    credentials: true
}));

app.use(express.json());

app.use("/gemini",require("./route/geminiAPI"));



const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("Connected to PORT",PORT);
} )