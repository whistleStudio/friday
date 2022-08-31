// const { application } = require("express");
const express = require("express");
// const { createServer } = require("http");
// const { Server } = require("socket.io");
require("./core/db/connect")
const PORT = 3000
const logApi = require("./core/api/logApi")
const dataApi = require("./core/api/dataApi")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/login", logApi)
app.use("/data", dataApi)

// const httpServer = createServer(app);
// const io = new Server(httpServer, { /* options */ });

// io.on("connection", (socket) => {
//   // ...
// });

app.listen(PORT, ()=>{console.log(`server works on ${PORT}`)});