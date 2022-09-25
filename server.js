const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const dotenv = require("dotenv");

let { log } = require("./listeners/any")
let { toggleLobby, startGame } = require("./listeners/dashboard")
let { addMoney, buyResource, sellResource, buyAutoClicker } = require("./listeners/gameboard")
let { getPlayer, nameChange } = require("./listeners/any")
// let { buyResource } = require('./src/game');

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
  // client.on("getResources", getResources);
  client.on("log", log);
  client.on("buyAutoclicker", buyAutoClicker);
  // client.on("nameChange", nameChange);
});

setInterval(() => {
  let status;
  if(global.game) {
    if(global.game.hasStarted) {
      global.game.process()
    }
    status = global.game.getStatus()
  } else {
    status = {running: false}
  }
  console.log("game status players --->", status.players);
  
  io.emit("gameStatus", status)
}, 100)

module.exports = {
  lobby,
}
