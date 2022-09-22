import { Server } from "socket.io";
const io = new Server();
const dotenv = require("dotenv");
const { routeMap } = ("./src/routeClass.js");
const { outboundSwitchboard } = ('./src/outboundSwitchboard.js');
let { Game } = require("./src/game")
let game;
let lobby = [];
dotenv.config();
io.listen(process.env.PORT || 3500);

const allClients = [];
io.on("connection", (client) => {
  console.log('connection');
  allClients.push(client);
  client.on("ping", (message) => inboundSwitchboard(message));
  // this could be run through a diagnostics function first that handles any health checks like waiting times, then passes to switchboard when finished
});

//////////////////////////////////////
// an example message might look like:

// const message =
// {
//   route: 'addition',
//   id: socket.id,
//   intendedReciever: 'sender',
//   clientRoute: 'example',
//   payload:
//   {
//     stuff: 'pog',
//   }
// }
//////////////////////////////////////

function inboundSwitchboard(message) {
  const route = routeMap.get(message.route);
  if (route) {
    outboundSwitchboard(route.invoke(message));
  } else {
    throw new Error(`Your message's route was not found:`, message.route);
  }
}

module.exports = {
  allClients,
  game,
  lobby,
}