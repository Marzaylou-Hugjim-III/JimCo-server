"use strict";

const Chance = require("chance");
const chance = new Chance();
const { Grain, Steel, Copper, Gold } = require("./eco");

//what a game needs to do:
// * send players to game page
// * countdown to start
// *

const presets = [ // when game starts, randomly pick an array of resources in game. 
    [Grain, Steel, Copper, Gold],
];

class Player {
    money = 7000;
    playerResources = [];
    clickMultiplier = 1; // upgrade to be bought that allows a multiplier for each click, ie JimCoin added per click = 1*multiplier
    autoClicker = 0;

    constructor(clientId) {
        this.name = chance.animal();
        this.id = clientId;
    }

    loop() {
        this.playerResources.forEach(res => {
            res.value += res.auto
        })
    }
    
};

class Game {
    hasStarted = false;

    constructor(playerIds) {
        //change to Resource
        this.resources = this.instantiateResources(chance.pickone(presets));
        this.players = this.instantiatePlayers(playerIds);
        this.startGame();
        //this.countdownToStart(2000);
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
                clickMultiplier
            } = player
            players.push({
                id: id,
                money: money,
                playerResources: playerResources,
                clickMultiplier: clickMultiplier,
                autoClicker: autoClicker,
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

    // countdownToStart(time) {
    //     if (!time) {
    //         this.startGame();
    //     }
    //     else {
    //         console.log(time / 1000, "seconds before begin");
    //         setTimeout(() => {
    //             this.countdownToStart(time - 1000);
    //         }, 1000);
    //     }
    // }
    ///turns all player ids into player objects
    instantiatePlayers(ids) {
        return ids.map((id) => {
            const playerResources = [];
            this.resources.forEach((res) => {
                playerResources.push({
                    name: res.name,
                    value: 0,
                    auto: 0,
                })
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
        if(player.money > 10000) {
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
        //console.log("STARTING!!!")
        this.hasStarted = true
    }

    process() {
        //update all resources
        this.resources.forEach(resource => resource.loop())
        this.players.forEach(player => {
            player.loop()
            //this has to come last since it can win the whole game
            this.addMoney(player, player.autoClicker * 1)
        })
    }

    finishGame(winner) {
        console.log(`${winner.name} has won!`);
        clearInterval(this.processId)
        global.game = null;
    }
}

module.exports = {
    Game,
}