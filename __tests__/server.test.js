const { routeMap } = require('../src/routeClass')

describe('Classes invoke successfully', () => {
  
  it('Invokes example', () => {
    expect(routeMap.get('example').invoke('hello world')).toEqual('hello world');
  });

  it('Invokes getResources', () => {
    expect(routeMap.get('getResources').invoke({payload: 'hello world'})).toEqual({
      payload: {resourceArray:[{name: 'Grain', quantity: 1, price: 2},{name: 'Steel', quantity: 100, price: 7}]}
    });
  });

  it('Invokes example', () => {
    expect(routeMap.get('example').invoke('hello world')).toEqual('hello world');
  });

  it('Invokes example', () => {
    expect(routeMap.get('example').invoke('hello world')).toEqual('hello world');
  });

  it('Invokes example', () => {
    expect(routeMap.get('example').invoke('hello world')).toEqual('hello world');
  });

  it('Invokes example', () => {
    expect(routeMap.get('example').invoke('hello world')).toEqual('hello world');
  });

  it('Invokes example', () => {
    expect(routeMap.get('example').invoke('hello world')).toEqual('hello world');
  });

});