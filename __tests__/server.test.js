const { Game } = require('../src/game');
const { addMoney, buyResource, sellResource, buyAutoClicker, buyAutoResource, buyMultiplier } = require('../listeners/gameboard');
const { toggleLobby } = require('../listeners/dashboard');
global.game;
global.lobby = [];
global.allClients = [{name: 'client', id: 123, emit: jest.fn()}];

describe('Sockets invoke successfully', () => {
  beforeEach(() => {
    global.game = new Game([123]);
  });

  afterEach(() => {
    game = null;
  });

  it('adds money', () => {
    addMoney(123, 5);
    expect(global.game.players[0].money).toBeGreaterThanOrEqual(5);
  });
  
  it('buys resources', () => {
    addMoney(123, 5000);
    buyResource(123, 'Grain', 1);
    expect(global.game.players[0].playerResources[0].value).toBe(1);
  });

  it('sells resources', () => {
    addMoney(123, 5000);
    buyResource(123, 'Grain', 1); // costs 2
    sellResource(123, 'Grain', 1);
    expect(global.game.players[0].money).toBe(17000);
  });

  it('buys autoclicker', () => {
    addMoney(123, 5000);
    buyAutoClicker(123);
    expect(global.game.players[0].autoClicker).toBe(1);
  });

  it('buys multiplier', () => {
    addMoney(123, 5000);
    buyMultiplier(123);
    expect(global.game.players[0].clickMultiplier).toBe(2);
  });
});