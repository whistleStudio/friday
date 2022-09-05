const express = require("express");
require("./core/db/connect")
const PORT = 3000
const logApi = require("./core/api/logApi")
const dataApi = require("./core/api/dataApi")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/login", logApi)
app.use("/data", dataApi)


app.listen(PORT, ()=>{console.log(`server works on ${PORT}`)});