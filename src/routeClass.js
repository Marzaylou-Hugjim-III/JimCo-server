const routeMap = new Map();

class Route {
  static name = "error";
  static subclasses = new Set();
  constructor() {
    routeMap.set(this.constructor.name, this);
  }

  invoke(message) {
    return;
  }
}

///////////////////////////////////////////////////////////////////////
// Below is an example of how classes should be written
// - A name that the package 'targets'
// - Invoke always takes in the client packet
// - Imported your function from another file.
// - - Your function should return its output.
// - - The output should be a mutated version of the packet.
// - Invoke should always return your function's mutated message
//
// You do NOT need to instantiate your class ( ie: new ExampleRoute() )
// This is done for you below automatically
// Do not change the Route.subclasses.add(this) line

class ExampleRoute extends Route {
  static name = "example";
  static { Route.subclasses.add(this) };
  invoke(message) {
    // write code here
    return message; // used so that outboard switchboard has something to navigate with. 
  }
}

class resourceRoute extends Route {
  static name = "resource"; // only change the assigned name
  static { Route.subclasses.add(this) }; // dont touch
  invoke(message) { // the message comes from the client. 
    // write code here
    return message; // used so that outboard switchboard has something to navigate with. 
  }
}

Route.subclasses.forEach(child => new child());
module.exports = {
  routeMap,
}