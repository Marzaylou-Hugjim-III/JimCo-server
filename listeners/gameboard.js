const { getClientByID } = require("./any");

function addMoney(id, amt) { 
  if (!global.game) {
    return
  }
  const player = global.game.id2player(id);
  player.money += amt*player.multiplier; 
  const client = getClientByID(id)
  client.emit("moneyChanged", player.money)
}

function buyResource(id, name, amt) {
  if (!global.game) {
    return
  }
  const player = global.game.id2player(id);
  const resource = global.game.name2resource(name)

  if(player.money < amt * resource.price || amt> resource.quantity){
      return;
  }
  //resource.quantity
  player.money -= amt * resource.price;
  const index = player.playerResources.inde
  const newAmt = player.playerResources.quantity + amt;
  player.playerResources[resource.name] = newAmt;
  resource.quantity -= amt;
  const client = getClientByID(id)
  client.emit("resourcesChanged", name, newAmt)
}

function sellResource(id, name, amt) {
  const resource = global.game.name2resource(name)
  if (!global.game) {
    return
  }
  const player = global.game.id2payer(id);
  const newAmt = player.sellResource(amt);
  const client = getClientByID(id);
  client.emit("resourcesChanged", name, newAmt);
}

function buyAutoClicker() { // each level adds 2500 to price
  if (this.money >= 2500 * (autoClicker + 1)) {
      if (!autoClicker > 0) {
          return;
      } else {
          this.money -= 2500 * (autoClicker + 1);
          this.autoClicker++;
      }
  }
}

module.exports = {
  addMoney,
  buyResource,
  sellResource,
  buyAutoClicker,
}