
function getPlayer(id) {
  if (!game) {
    return
  }
  const player = game.id2player(id); 
  const client = getClientByID(id)
  client.emit("recievedPlayer", player);
}

function log(string) {
  console.log(string);
  io.emit("serverLog")
}

function getClientByID(id) {
  for(let client of global.allClients) {
    if(client.id === id) {
      return client;
    }
  }
}

function nameChange(message) {
  getPlayer(message.id).name = message.name;
}

function chatMessage(name, content) {
  global.chat.push({
    name: name,
    content: content,
  })
  if(global.chat.length > 100) {
    global.chat.shift()
  }
}

module.exports = {
  log,
  getPlayer,
  getClientByID,
  nameChange,
  chatMessage,
}
