const { getClientByID } = require("./any");

function addMoney(id, amt) {
  console.log("add money ran on the background");
  if (!global.game) {
    return
  }
  const player = global.game.id2player(id);
  player.money += amt * (player.clickMultiplier + 1);
  const client = getClientByID(id)
  client.emit("moneyChanged", player.money);
}

function buyResource(id, name, amt) {
  if (!global.game) {
    return
  }
  const player = global.game.id2player(id);
  const resource = global.game.name2resource(name)

  if (player.money < amt * resource.price || amt > resource.quantity) {
    return;
  }
  //resource.quantity
  player.money -= amt * resource.price;
  resource.quantity -= amt;
  player.playerResources = player.playerResources.map(res => {
    if(res.name !== name) {
      return res;
    }
    res.value += amt;
    return res;
  })
  const client = getClientByID(id)
  client.emit("resourcesChanged", player.playerResources)
  client.emit("moneyChanged", player.money)
}

function sellResource(id, name, amt) {
  if (!global.game) {
    return
  }
  const player = global.game.id2player(id);
  const resource = global.game.name2resource(name)

  let sold = 0
  player.playerResources = player.playerResources.map(res => {
    if(res.name !== name) {
      return res;
    }
    if(res.value < amt) {
      return res;
    }
    res.value -= amt;
    sold += amt;
    return res;
  })
  
  if(!sold) {
    return;
  }
  //resource.quantity
  player.money += amt * resource.price;
  resource.quantity += amt;
  const client = getClientByID(id)
  client.emit("resourcesChanged", player.playerResources)
  client.emit("moneyChanged", player.money)
}

function buyAutoClicker(id) { // each level adds 2500 to price
  const player = global.game.id2player(id);

  if (player.money >= 200 * ((player.autoClicker + 1)*.6)) {
    console.log("buying clicker")
    player.money -= 200 * ((player.autoClicker + 1)*.6);
    player.autoClicker++;
  }
  console.log("could not afford. money:", player.money, "is not greater or equal to,", 1200 * (player.autoClicker + 1))
}

function buyMultiplier(id) { // each level adds 2500 to price
  const player = global.game.id2player(id);

  if (player.money >= 500 * (player.multiplier + 1)) {
    player.money -= 500 * (player.multiplier + 1);
    player.multiplier++;
  }
}

function buyAutoResource (id, resourceName){
  const player = global.game.id2player(id);

  const resource = player.playerResources.filter(res => {
    if(res.name === resourceName) {
      return true;
    }
    return false;
  })[0];

  const cost = 3000 * (resource.auto + 1)

  if(player.money >= cost) {
    player.money -= cost;
    resource.auto += 1;
  }
}

module.exports = {
  addMoney,
  buyResource,
  sellResource,
  buyAutoClicker,
  buyMultiplier,
  buyAutoResource
}