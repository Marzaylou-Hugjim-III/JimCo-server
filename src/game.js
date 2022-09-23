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
    resourceMap = undefined;

    constructor(clientId) {
        this.name = chance.animal();
        this.id = clientId;
    }

    getResourceCount(name) {
        return this.resourceMap.get(name);
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
            const resourceMap = new Map();
            this.resources.forEach((res) => {
                resourceMap.set(res.name, 0);
            });
            const player = new Player(id)
            player.resourceMap = resourceMap
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
        return null;
    }

    startGame() {
        console.log("starting");
        this.processId = setInterval(() => {this.process()}, 50)
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

module.exports = {
    Game
}