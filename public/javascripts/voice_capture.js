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

socket.on("output", function (message) {
    alert(message.out);
    document.getElementById("output_area").value = message.out;
    document.getElementById("output_area").value += message.err;
});

socket.on("disconnect", function() {
    console.log("Disconnected from Server");
});

let message = document.querySelector("#message");
let area =  document.getElementById("code_area");
let SpeechRecognition = webkitSpeechRecognition;
let SpeechGrammarList = webkitSpeechGrammarList;

let grammar = "#JSGF V1.0;";
let recognition = new SpeechRecognition();
let grammarList = new SpeechGrammarList();
grammarList.addFromString(grammar, 1);

recognition.grammars = grammarList;
//recognition.lang = "hi-IN";
recognition.lang = "en-IN";
recognition.interimResults = false;
recognition.continuous = true;

recognition.onresult =  function (event) {

    let last = event.results.length - 1;
    let command = event.results[last][0].transcript;
    //alert(command);
    let content = command.toLocaleLowerCase().trim();

    content = content.replace(/plus/g, "+");
    content = content.replace(/minus/g, "-");
    content = content.replace(/star/g, "*");
    content = content.replace(/divide/g, "/");
    content = content.replace(/equal/g, "=");

    message.innerHTML = content;
    let code = document.getElementById("code_area").value;
    //alert(code);
    if(content == "run"){
        socket.emit("code2run", {
            code : code
        });
    } else{
        socket.emit("createMessage", {
            content : content
        });
    }
}

recognition.onspeechend = function () {
    recognition.stop();
}

recognition.onerror = function (event) {
    message.textContent = "Error : " + event.error;
}