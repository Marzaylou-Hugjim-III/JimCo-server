const { allClients } = require("../server.js");

function getClientByID(id) {
  let output;
  console.log("allClients", allClients);
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
  getClientByID,
  emitToOthers,
};
