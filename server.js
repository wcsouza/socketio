var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 8080;

var clients = {};

app.get("/", function(req, res) {
  res.send("server is running");
});

app.use(express.static('public'));

// app.get('/index', function(request, response){
//   response.sendfile('./public/index.html');
// });

io.on("connection", function(client) {
  client.on("join", function(name) {
    console.log("Joined: " + name);
    clients[client.id] = name;
    client.emit("update", "You have connected to the server.");
    client.broadcast.emit("update", name + " has joined the server.");
  });

  client.on("send", function(msg) {
    console.log("Message: " + msg);
    client.broadcast.emit("chat", clients[client.id], msg);
  });

  client.on("disconnect", function() {
    console.log("Disconnect");
    io.emit("update", clients[client.id] + " has left the server.");
    delete clients[client.id];
  });
});

http.listen(port, function() {
  console.log("listening on port " + port);
});
