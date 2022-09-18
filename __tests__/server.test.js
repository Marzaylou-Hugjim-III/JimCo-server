//import { routeMap } from '../src/routeClass';
const { routeMap } = require('../src/routeClass')

describe('Classes invoke successfully', () => {
  
  it('Invokes example', () => {
    expect(routeMap.get('example').invoke('hello world')).toEqual('hello world');
  });

});