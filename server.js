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
const { outboundSwitchboard } = require("./src/outboundSwitchboard");
dotenv.config();
io.listen(process.env.PORT || 3500);

const allClients = [];
io.on("connection", (client) => {
  console.log("connection");
  allClients.push(client);
  client.on("ping", (message) => inboundSwitchboard(message));
  // this could be run through a diagnostics function first that handles any health checks like waiting times, then passes to switchboard when finished
});

console.log("test");
//////////////////////////////////////
// an example message might look like:

// const message =
// {
//   route: 'addition',
//   id: socket.id,
//   intendedReciever: 'sender',
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
console.log("allClients server", allClients);

module.exports = {
  allClients,
};
