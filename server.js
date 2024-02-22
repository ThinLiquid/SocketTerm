import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as pty from "node-pty";

const app = express()
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use('/node_modules/', express.static('node_modules'));

server.listen(8080);
console.log("Listening on *:8080");

io.on('connection', (socket) => {
  console.log("connection", socket.id);

  const term = pty.spawn(process.platform === 'win32' ? 'cmd' : 'bash', [], {});

  // @ts-ignore
  term.on("data", data => {
    socket.emit("message", data);
  });

  socket.on("message", data => {
    term.write(data);
  });
});
