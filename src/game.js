"use strict";

const Chance = require("chance");
const chance = new Chance();
const Resource = require("./eco");

//what a game needs to do:
// * send players to game page
// * countdown to start
// *

const presets = [
    [Resource, Resource, Resource],
];

class Game {
    constructor(playerIds) {
        //change to Resource
        this.resources = [];
        this.resources = this.instantiateResources(chance.pickone(presets));
        this.players = this.instantiatePlayers(playerIds);
        this.countdownToStart(5000);
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
            const player = {
                clientId: id,
                money: 0,
                resources: resourceMap,
            };
            return player;
        });
    }
    ///turns all player ids into player objects
    instantiateResources(preset) {
        return preset.map((Class) => new Class());
    }
    startGame() {
        console.log("starting");
        setTimeout(this.finishGame, 5000);
    }
    finishGame() {
        console.log("ending");
    }
}
const game = new Game(["testing testing"]);
