const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const dotenv = require("dotenv");
const { routeMap } = require("./src/routeClass");
let { Game } = require("./src/game")
let game;
let lobby = [];
dotenv.config();
io.listen(process.env.PORT || 3500);

const allClients = [];
io.on("connection", (client) => {
  console.log("connection", client);
  allClients.push(client);

  client.on("addMoney", addMoney)

  client.on("ping", (message) => inboundSwitchboard(message));
  // this could be run through a diagnostics function first that handles any health checks like waiting times, then passes to switchboard when finished
});

function addMoney(id, amt) { // the message comes from the client.
  if(!game) {
    return
  }
  const player = game.id2player(message.id); // return player object which sent the message
  game.addMoney(player, message.payload.amt); 
  const client = getClientByID(id)
  client.emit("moneyAdded", amt)
}

function inboundSwitchboard(message) {
  console.log('Client has pogged', message);
  const route = routeMap.get(message.route);
  if (route) {
    outboundSwitchboard(route.invoke(message));
  } else {
    throw new Error(`Your message's route was not found:`, message.route);
  }
}

function outboundSwitchboard(message) {
  const { intendedReciever, id, clientRoute } = message
  if(!intendedReciever) {
    return
  }
  switch (intendedReciever) {
    case 'sender':
      getClientByID(id)?.emit("pong", message);
      break;
    case 'others':
      emitToOthers(id, message);
      break;
    case 'all':
      io.emit(message);
    default:
      break;
  }
}

function getClientByID(id) {
  let output;
  //console.log("allClients", allClients);
  allClients.forEach((client) => {
    // use allClients.find
    client.id === id ? (output = client) : null;
  });
  return output;
} // this could instead directly emit to client witth error handling

function emitToOthers(ignoredId, message) {
  for (const client of allClients) {
    if (client.id === ignoredId) {
      continue;
    }
    client.emit("pong", message);
  }
}

module.exports = {
  allClients,
  game,
  lobby,
}
