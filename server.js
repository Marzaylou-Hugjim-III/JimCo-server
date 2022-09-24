const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const dotenv = require("dotenv");
let { Game } = require("./src/game")

let game;
let lobby = [];

dotenv.config();
io.listen(process.env.PORT || 3500);

const allClients = [];
io.on("connection", (client) => {
  allClients.push(client);

  client.on("addMoney", addMoney);
  client.on("getPlayer", getPlayer);
  client.on("joinLobby", joinLobby);
  client.on("startGame", startGame);
  client.on("getResources", getResources);
  client.on("log", log)
});

function log(string) {
  console.log(string);
  io.emit("serverLog")
}

function addMoney(id, amt) { 
  if (!game) {
    return
  }
  const player = game.id2player(id);
  if(!player) {
    console.warn("could not find player to match", id)
    return
  }
  player.money += amt 
  const client = getClientByID(id)
  client.emit("moneyAdded", player.money)
}

function getResources(id) { 
  if (!game) {
    return
  }
  const player = game.id2player(id)
  const returned = {}
  game.resources.forEach(resource => {
    returned[resource.name] = player.getResourceCount(resource.name);
  })

  const client = getClientByID(id);
  client.emit("getResources", returned);
}

function startGame() { 
  if (game) {
    console.log("already game in progress")
    return
  }
  console.log("game started, lobby:", lobby)
  game = new Game(lobby)
  lobby.forEach(id => {
    const inLobbyClient = getClientByID(id)
    inLobbyClient.emit("gameStarting")
  })
}

function getPlayer(id) {
  if (!game) {
    return
  }
  const player = game.id2player(id); 
  const client = getClientByID(id)
  client.emit("recievedPlayer", player);
}

function joinLobby(id) { 
  console.log("lobby joined")
  lobby.push(id)
  const client = getClientByID(id)
  client.emit("recievedLobby", lobby);
}

function getClientByID(id) {
  for(let client of allClients) {
    if(client.id === id) {
      return client;
    }
  }
}

module.exports = {
  allClients,
  game,
  lobby,
}
