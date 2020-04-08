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
       console.log("Create Message : ", message.content);
       send_code(driver, message.content)
       /*io.emit("newMessage", {
           from : message.from,
           to : message.to,
           createdAt : new Date().getTime()
       });*/

       // io.emmit: Broadcast message to every connected user including Sender
       // socket.broadcast.emit: Broadcast message to every connected user excluding Sender
       /*socket.broadcast.emit("newMessage", {
           from : message.from,
           to : message.to,
           createdAt : new Date().getTime()
       });*/
   });
   socket.on("disconnect", () => {
       console.log("Disconnected from Server");
   });
});

async function send_code(driver, code) {
    let codeMirror = await driver.findElement(By.className("CodeMirror"));

    /* getting the first line of code inside codemirror and clicking it to bring it in focus */
    let lines = await codeMirror.findElements(By.className("CodeMirror-line"));
    let codeLine = "";
    let arr = code.split(" ");
    if(arr[0] == "line"){
        if(arr[2] > lines.length){
            codeLine = lines[lines.length-1];
        }else{
            codeLine = lines[arr[2]-1];
        }
        codeLine.click();
    }
    else {
        if(lines.length > 0){
            codeLine = lines[lines.length-1];
        }else {
            codeLine = lines[0];
        }
        codeLine.click();
        /* sending keystokes to textarea once codemirror is in focus */
        let txtbx = await codeMirror.findElement(By.css("textarea"));
        await txtbx.sendKeys(code);
    }
}

server.listen(port, function(){
    console.log("Server is running on port ${port} 3000");
});

let webDriver = require("selenium-webdriver");
let By = webDriver.By;
let until = webDriver.until;
let Key = webDriver.Key;

let driver = new webDriver.Builder().forBrowser("chrome").build();
driver.get("http://localhost:3000/VoiceBasedIDE_1.html");