"use strict";

const Chance = require("chance");
const chance = new Chance();
const { Grain, Steel } = require("./eco");

//what a game needs to do:
// * send players to game page
// * countdown to start
// *

const presets = [ // when game starts, randomly pick an array of resources in game. 
    [Grain, Steel],
];

class Player {
    money = 0;
    playerResourceMap = undefined;
    clickMultiplier = 1; // upgrade to be bought that allows a multiplier for each click, ie JimCoin added per click = 1*multiplier
    autoClicker = 0;
    autoGrain = 0;
    autoSteel = 0;


    constructor(clientId) {
        this.name = chance.animal();
        this.clientId = clientId;
    }
    buyAutoGrain() {
        if (this.money > 2000 * (autoGrain + 1)) {
            if (!autoGrain > 0) {
                return;
            } else {
                this.money -= 2000 * (autoGrain + 1);
                autoGrain++;
            }
        } else {
            console.log("Not enough money to buy autoGrain");
        }
    }
    buyAutoSteel() {
        if (this.money > 2000 * (autoSteel + 1)) {
            if (!autoSteel > 0) {
                return;
            } else {
                this.money -= 2000 * (autoSteel + 1);
                this.autoSteel++
            }
        } else {
            console.log("Not enough money to buy autoSteel");
        }
    }
    buyClickMultiplier() { // each level adds 1000*2^clickMultiplier
        if (this.money >= 1000 * Math.pow(2, this.clickMultiplier) && this.clickMultiplier < 11) {
            this.money -= 1000 * Math.pow(2, this.clickMultiplier);
            this.clickMultiplier++;
        }
    };
    buyAutoClicker() { // each level adds 2500 to price
        if (this.money >= 2500 * (autoClicker + 1)) {
            if (!autoClicker > 0) {
                return;
            } else {
                this.money -= 2500 * (autoClicker + 1);
                this.autoClicker++;
            }
        }
    }

    buyResource(amt, resource) {
        if (this.money >= resource.price * amt && resource.quantity > amt) {
            this.money -= resource.price * amt && resource.quantity;
            this.playerResourceMap.set(resource.name, this.playerResourceMap.get(resource.name) + amt);
        }
    }
    sellResource(amt, resource) {
        if (this.playerResourceMap.get(resource.name) > amt) {
            this.money += resource.price * amt && resource.quantity;
            this.playerResourceMap.set(resource.name, this.playerResourceMap.get(resource.name) - amt);
        }
    }

    getResourceCount(name) {
        return this.playerResourceMap.get(name);
    }

    implementAutoGrain() {
        if (!autoGrain > 0) {
            return
        } else {
            this.playerResourceMap.set("Grain", this.playerResourceMap.get(resource.name) + this.autoGrain);
        }
    }
    implementAutoSteel() {
        if (!autoSteel > 0) {
            return
        } else {
            this.playerResourceMap.set("Steel", this.playerResourceMap.get(resource.name) + this.autoSteel);
        }
    }
};

class Game {
    ///id of the process() ticker
    processId = undefined;

    constructor(playerIds) {
        //change to Resource
        this.resources = this.instantiateResources(chance.pickone(presets));
        this.players = this.instantiatePlayers(playerIds);
        this.countdownToStart(1000);
    }
    countdownToStart(time) {
        if (!time) {
            this.startGame();
        }
        else {
            console.log(time / 1000, "seconds before begin");
            setTimeout(() => {
                this.countdownToStart(time - 1000);
            }, 1000);
        }
    }
    ///turns all player ids into player objects
    instantiatePlayers(ids) {
        return ids.map((id) => {
            const playerResourceMap = new Map();
            this.resources.forEach((res) => {
                playerResourceMap.set(res.name, 0);
            });
            const player = new Player(id)
            player.playerResourceMap = playerResourceMap
            return player;
        });
    }
    ///turns all player ids into player objects
    instantiateResources(preset) {
        return preset.map((Class) => new Class());
    }

    addMoney(player, amt) { // amt should be from clicks and resources sold during last tick. 
        player.money += amt;
        //add money, in whatever bounds
        //did this player win
        if (player.money > 100000) {
            this.finishGame(player)
        }
    }

    //given an id, returns a player in the game
    id2player(id) {
        for (const player of this.players) {
            if (player.id === id) {
                return player
            }
        }
        return null;
    }

    startGame() {
        console.log("starting");
        this.processId = setInterval(() => { this.process() }, 100)
    }

    process() {
        //update all resources
        this.resources.forEach(resource => resource.loop())
    }

    finishGame(winner) {
        console.log(`${winner.name} has won!`);
        clearInterval(this.processId)
    }
}

let testing = new Game(["hiii"])

module.exports = {
    Game
}