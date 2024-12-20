const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config()
const cookie = require("cookie-parser");
const allRoutue = require("./routers/userRoute");

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DB ACTIVE");
})
.catch((err)=>{
    console.log(err.message);
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie())

app.use((err, req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message,
    })
})

app.use("/api/user",allRoutue)
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})