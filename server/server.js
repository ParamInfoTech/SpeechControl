const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io")

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "/../public");

let app = express();
app.use(express.static(publicPath));

let server = http.createServer(app);
let io = socketIO(server);

io.on("connection", (socket) => {
   console.log("New Connection");
   /*socket.emit("newMessage", {
       from : "Vijay",
       msg : "How are you?"
   });*/

   socket.on("createMessage", (message) => {
       console.log("Create Message : ", message);
       /*io.emit("newMessage", {
           from : message.from,
           to : message.to,
           createdAt : new Date().getTime()
       });*/

       // io.emmit: Broadcast message to every connected user including Sender
       // socket.broadcast.emit: Broadcast message to every connected user excluding Sender
       socket.broadcast.emit("newMessage", {
           from : message.from,
           to : message.to,
           createdAt : new Date().getTime()
       });
   });
   socket.on("disconnect", () => {
       console.log("Disconnected from Server");
   });
});

server.listen(port, function(){
    console.log("Server is running on port ${port} 3000");
});