const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const dotenv = require("dotenv");

let { log, chatMessage } = require("./listeners/any");
let { toggleLobby, startGame } = require("./listeners/dashboard")
let { addMoney, buyResource, sellResource, buyAutoClicker, buyMultiplier, buyAutoResource } = require("./listeners/gameboard")
let { getPlayer, nameChange } = require("./listeners/any")


global.chat = [];
global.game;
global.lobby = [];
global.allClients = [];

dotenv.config();
io.listen(process.env.PORT || 3500);

io.on("connection", (client) => {
  global.allClients.push(client);

  client.on("addMoney", addMoney);
  client.on("sellResource", sellResource);
  client.on("buyResource", buyResource);
  client.on("getPlayer", getPlayer);
  client.on("toggleLobby", toggleLobby);
  client.on("startGame", startGame);
  client.on("log", log);
  client.on("buyAutoClicker", buyAutoClicker);
  client.on("buyAutoResource", buyAutoResource);
  client.on("buyMultiplier", buyMultiplier);
  client.on("nameChange", nameChange);
  client.on("chatMessage", chatMessage);
});

setInterval(() => {
  let status;
  try {
    if(global.game) {
      if(global.game.hasStarted) {
        global.game.process()
      }
      status = global.game?.getStatus()
    } else {
      status = {
        running: false,
        chat: global.chat,
      }
    }
    if(status?.players?.length) {
      console.log("game status --->", status);
    }
  } catch (e) {
    status = {
      running: false,
      chat: global.chat,
    }
  }
  io.emit("gameStatus", status)
}, 500)

module.exports = {
  lobby,
}
