const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("./core/db/connect")
const PORT = 3000
const logApi = require("./core/api/logApi")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/login", logApi)

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(PORT, ()=>{console.log(`server works on ${PORT}`)});