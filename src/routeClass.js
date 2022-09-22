const routeMap = new Map();
const resourceMap = require('./eco');
const { game, lobby } = require("../server")

class Route {
  static name = "error";
  static subclasses = new Set();
  constructor() {
    routeMap.set(this.constructor.name, this);
  }

  invoke(message) {
    return;
  }
}

///////////////////////////////////////////////////////////////////////
// Below is an example of how classes should be written
// - A name that the package 'targets'
// - Invoke always takes in the client packet
// - Imported your function from another file.
// - - Your function should return its output.
// - - The output should be a mutated version of the packet.
// - Invoke should always return your function's mutated message
//
// You do NOT need to instantiate your class ( ie: new ExampleRoute() )
// This is done for you below automatically
// Do not change the Route.subclasses.add(this) line

class ExampleRoute extends Route {
  static name = "example";
  static { Route.subclasses.add(this) };
  invoke(message) {
    console.log('Example pog');
    return message; // used so that outboard switchboard has something to navigate with. 
  }
}

class getResourcesRoute extends Route {
  static name = "getResources"; // only change the assigned name
  static { Route.subclasses.add(this) }; // dont touch
  invoke(message) { // the message comes from the client. 
      let resourceArray = [];
      Object.keys(resourceMap).forEach(key => resourceArray.push({name: key.name, quantity: key.quantity, price: key.price }));
    message.payload = { 
      resourceArray
  };
    return message; // used so that outboard switchboard has something to navigate with. 
  }
}

class addMoneyRoute extends Route {
  static name = "addMoney"
  static { Route.subclasses.add(this) }; // dont touch
  invoke(message) { // the message comes from the client.
    if(!game) {
      return
    }
    const player = game.id2player(message.id); // return player object which sent the message
    game.addMoney(player, message.payload.amt); 
    message.payload = {
      id: message.id,
      money: amt,
    }
    return message //update the player's money count
  }
}

class joinLobbyRoute extends Route {
  static name = "joinLobby"
  static { Route.subclasses.add(this) }; // dont touch
  invoke(message) { // the message comes from the client.
    lobby += message.id
    message.payload = {
      success: true
    }
    return message //tell the player we joined
  }
}

class startGameRoute extends Route {
  static name = "startGame"
  static { Route.subclasses.add(this) }; // dont touch
  invoke(message) { // the message comes from the client.
    if(game) {
      return
    }
    game = new Game(lobby)
    message.payload = {
      success: true
    }
    return message //update the player's money count
  }
}

class getPlayer extends Route {
  static name = "getPlayer"
  static { Route.subclasses.add(this) }; // dont touch
  invoke(message) { // the message comes from the client.
    if(!game) {
      return
    }
    const player = game.id2player(message.id); // return player object which sent the message
    message.payload = player
    return message //send players
  }
}

Route.subclasses.forEach(child => new child());
module.exports = {
  routeMap,
}
