// the goal is to have no fractional JimCoins. 
const resourceMap = new Map();

class Resource {
  static name;
  static subclasses = new Set();
  constructor() {    // the name/key       value
    resourceMap.set(this.constructor.name, this);
  }
  maxPrice; // resource will not sell for more than this, this is price at quantity of one
  minPrice; // will not sell for less, this is price at quantity = 1000
  rateOfProd; // number of resources produced per tick
  price; // the discrete price of buying one of this resource. 
  quantity; // min of zero, max of 1000
  multiplier; // scalar used to help determine how much rateOfProd can change per tick. 

  productionRate = () => {
    this.rateOfProd = Math.floor(Math.random() * this.multiplier);
    return this.rateOfProd;
  };

  priceCalc = () => {
    this.price = Math.round(((this.maxPrice - this.minPrice) / (1000)) * this.quantity + this.minPrice);
    if (this.price > this.maxPrice) {
      this.price = this.maxPrice;
    }
    if (this.price < this.minPrice) {
      this.price = this.minPrice;
    }
    return Math.round(this.price);
  };

  quantityCalc = () => {
    this.quantity = this.quantity + productionRate(this);// need to subtract amount bought and add amount sold.  
  }

  loop = () => {
    productionRate(resource); // determine what the amount produced will be
    quantity(resource); // determine what the new amount will be
    price(resource); // determine what the new price will be. 
  }

};

class Grain extends Resource {
  static name = "Grain";
  static {
    resource.subclasses.add(this); // sets subclasses as a set and adds each child to it. 
  }
  maxPrice = 17; // resource will not sell for more than this, this is price at quantity of one
  minPrice = 3; // will not sell for less, this is price at quantity = 1000
  rateOfProd = 2; // number of resources produced per tick
  price = 2; // the discrete price of buying one of this resource. 
  quantity = 1; // min of zero, max of 1000
  multiplier = 13; // scalar used to help determine how much rateOfProd can change per tick. 


}
Resource.subclasses.forEach(resource => new resource());// autmatically instantiates each class that we make, and each one is added to the map we need to export. 
// map puts classes in an object then gives them keys. basically.... 





module.exports = {
  resourceMap,
}
