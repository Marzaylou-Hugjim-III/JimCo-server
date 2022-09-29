const { getClientByID } = require("./any");
const { Game } = require("../src/game")

function toggleLobby(id) {
  for (let i; i < global.lobby.length; i++) {
    let lobbyId = global.lobby[i]
    if (lobbyId === id) {
      lobbyId.splice(i, 1)
    }
  }
  global.lobby.push(id)
  const client = getClientByID(id);
  if(!client) {
    global.lobby.splice(global.lobby.indexOf(id, 1))
  }
  client?.emit("recievedLobby", global.lobby);
}

function startGame() {
  if (global.game) {
    console.log("already game in progress")
    return
  }
  console.log("game started, lobby:", global.lobby)
  global.game = new Game(global.lobby)
  global.lobby.forEach(id => {
    const inLobbyClient = getClientByID(id)
    inLobbyClient.emit("gameStarting");
    console.log("Game instance ---->", Game);
  })
  global.lobby = [];
}

module.exports = {
  toggleLobby,
  startGame,
}
