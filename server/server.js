const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io")

const fs = require("fs");
const cp = require("child_process");

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

   socket.on("code2run", (code) => {
       console.log(code.code);
       fs.writeFileSync("abc.py", code.code, (err) =>{
           console.log("Error : " + err);
       });
       let cmd = cp.exec("python abc.py", (e, stdout, stderr) => {
           if (e instanceof Error) {
               console.error(e);
           }
           console.log('stdout ', stdout);
           console.log('stderr ', stderr);

           socket.emit("output", {
               out: stdout,
               err: stderr
           })
       });
    });

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

server.listen(port, function(){
    console.log("Server is running on port ${port} 3000");
});

let webDriver = require("selenium-webdriver");
let chrome = require("selenium-webdriver/chrome");
let By = webDriver.By;
let until = webDriver.until;
let Key = webDriver.Key;

let options = new chrome.Options();
options.addArguments("window-size=600,500");

let driver = new webDriver.Builder().forBrowser("chrome").setChromeOptions(options).build();
driver.get("http://localhost:3000/VoiceBasedIDE_2.html");

async function send_code(driver, code) {
    let txtbx = await driver.findElement(By.id("code_area"));
    let arr = code.split(" ");
    let options = ["(", ")", "," , '"', "'", "_", "__", "-", ".", ":"];
    let option_dict = {"one": 1, "two": 2, "to" : 2, "three": 3, "four": 4,
                        "five": 5, "six": 6, "seven": 7, "eight":8,
                        "nine": 9, "ten": 10};
    let words = ["enter", "up", "down", "tab", "space", "backward", "forward", "delete", "home", "back"];
    for(let i = 0; i < arr.length; i++){
        switch(arr[i]){
            case "enter":
                await txtbx.sendKeys(Key.RETURN);
                break;

            case "up":
                await txtbx.sendKeys(Key.ARROW_UP);
                break;

            case "down":
                await txtbx.sendKeys(Key.ARROW_DOWN);
                break;

            case "tab":
                await txtbx.sendKeys(Key.SPACE + Key.SPACE + Key.SPACE);
                break;

            case "space":
                await txtbx.sendKeys(Key.SPACE);

            case "backward":
                await txtbx.sendKeys(Key.ARROW_LEFT);
                break;

            case "forward":
                await txtbx.sendKeys(Key.ARROW_RIGHT);
                break;

            case "delete":
                await txtbx.sendKeys(Key.DELETE);
                break;

            case "back":
                await txtbx.sendKeys(Key.BACK_SPACE);
                break;

            case "home":
                await txtbx.sendKeys(Key.HOME);
                break;

            case "option":
                i = i + 1;
                console.log("Check : ", options[arr[i] -1], " " + arr[i]);
                let to_send = "";
                if(isNaN(arr[i])){
                    to_send = options[option_dict[arr[i]] -1];
                } else{
                    to_send = options[arr[i] -1];
                }
                await txtbx.sendKeys(to_send + "");
                break;

            default:
                await txtbx.sendKeys(arr[i] + " ");
        }
    }
}