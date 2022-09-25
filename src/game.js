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
    playerResources = undefined;
    clickMultiplier = 0; // upgrade to be bought that allows a multiplier for each click, ie JimCoin added per click = 1*multiplier
    autoClicker = 100000;
    autoGrain = 1;
    autoSteel = 1;

    constructor(clientId) {
        this.name = chance.animal();
        this.id = clientId;
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
            console.log("Not enough money to buy autoSteel"); // these might need to log something to the client later to tell them their purchase failed
        }
    }
    buyClickMultiplier() { // each level adds 1000*2^clickMultiplier
        if (this.money >= 1000 * Math.pow(2, this.clickMultiplier) && this.clickMultiplier < 11) {
            this.money -= 1000 * Math.pow(2, this.clickMultiplier);
            this.clickMultiplier++;
        } else {
            console.log("Not enoughh money to buy clickMultiplier");
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
    sellResource(amt, resource) {

        this.money+= amt*resource.price;
        const newAmt = this.playerResources.resource.quantity - amt
        this.playerResources[resource.name] = newAmt;
        resource.quantity += amt;
        return true
    }

    loop() {
        this.money += (this.autoClicker * 1) // initial goal was to have 1 click/tick
        this.playerResources["Steel"] += this.autoSteel; 
        this.playerResources["Grain"] += this.autoGrain; 
    }

    // getResourceCount(name) { // gets resources the player has. 
    //     return this.playerResources.get(name);
    // }
    
};

class Game {
    hasStarted = false;

    constructor(playerIds) {
        //change to Resource
        this.resources = this.instantiateResources(chance.pickone(presets));
        this.players = this.instantiatePlayers(playerIds);
        this.countdownToStart(2000);
    }

    // ticked by server.js, returns an object
    // object should be everything all game players need
    getStatus() {
        const players = [];
        for(const player of this.players) {
            const {
                id,
                money,
                playerResources,
                autoClicker,
                autoSteel,
                autoGrain,
                clickMultiplier
            } = player
            const mapResources = Object.keys(playerResources).map(name => {
                const value = playerResources[name]
                return {
                    name: name, 
                    value: value
                }
            })
            players.push({
                id: id,
                money: money,
                playerResources: mapResources,
                clickMultiplier: clickMultiplier,
                autoClicker: autoClicker,
                autoSteel: autoSteel,
                autoGrain: autoGrain,
            })
        }
        // const events = {}; // events or other gamestate modifiers should probably be a separate property on the object when they're made
        const resources = [];
        for(const resource of this.resources) {
            resources.push({
                name: resource.name,
                quantity: resource.quantity,
                price: resource.price
            })
        }

        return {
            running: true,
            players: players,
            resources: resources,
        }
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
            const playerResources = {};
            this.resources.forEach((res) => {
                playerResources[res.name] = 0;
            });
            const player = new Player(id)
            player.playerResources = playerResources
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
        if(player.money > 100000) {
            this.finishGame(player)
        }
    }

    //given an id, returns a player in the game
    id2player(id) {
        for(const player of this.players) {
            if(player.id === id) {
                return player
            }
        }
    }

    name2resource(name) {
        for(const resource of this.resources) {
            if(resource.name === name) {
                return resource
            }
        }
    }

    startGame() {
        this.hasStarted = true
    }

    process() {
        //update all resources
        this.resources.forEach(resource => resource.loop())
        this.players.forEach(player => player.loop())
    }

    finishGame(winner) {
        console.log(`${winner.name} has won!`);
        clearInterval(this.processId)
    }
}

module.exports = {
    Game,
}