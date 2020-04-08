let socket = io();

socket.on("connect", function() {
    console.log("Connected to Server");

    /*socket.emit("createMessage", {
        from :"Vijay",
        to : "Donot Know"
    });*/
});

socket.on("newMessage", function (message) {
    console.log("New Message : ", message);
});

socket.on("disconnect", function() {
    console.log("Disconnected from Server");
});