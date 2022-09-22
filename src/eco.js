// the goal is to have no fractional JimCoins. 
const resourceMap = new Map();

class Resource {
  static name;
  constructor() {    // the name/key       value
    resourceMap.set(this.constructor.name, this);
  }
  maxPrice; // resource will not sell for more than this, this is price at quantity of one
  minPrice; // will not sell for less, this is price at quantity = 1000
  rateOfProd; // number of resources produced per tick
  price; // the discrete price of buying one of this resource. 
  quantity; // min of zero, max of 1000
  multiplier; // scalar used to help determine how much rateOfProd can change per tick. 

  productionRate() {
    if(this.quantity > 200 && this.quantity <1200){ //essentially random increase, with an average of 5 more than zero between 200 and 1200
       this.rateOfProd = Math.floor(Math.sin(Math.random()*2*Math.PI) * this.multiplier+5);
       return this.rateOfProd;
    }
    if(this.quantity > 1200){  // with quantities higher than 1200, rate of production drops to 0. on a random number from 0-1 of higher than .8, remove up to 750 from quantity.
      let randomNum = Math.random();
      if(randomNum > .8){
        this.rateOfProd= Math.floor(Math.random()*-750);
        return this.rateOfProd;
      }
      return this.rateOfProd = 0;
    }
    else{ //slow, positive growth before quantity of 200
      this.rateOfProd = Math.floor(Math.random()*this.multiplier);
      return this.rateOfProd;
    }
  };

  priceCalc = () => {
    this.price = Math.round(((this.minPrice - this.maxPrice) / (1000)) * this.quantity + this.maxPrice);
    if (this.price > this.maxPrice) {
      this.price = this.maxPrice;
    }
    if (this.price < this.minPrice) {
      this.price = this.minPrice;
    }
    return Math.round(this.price);
  };

  quantityCalc = () => {
    this.quantity = this.quantity + this.rateOfProd;// need to subtract amount bought and add amount sold.  
  }

  loop = () => {
    this.productionRate(); // determine what the amount produced will be
    this.quantityCalc(); // determine what the new amount will be
    this.priceCalc(); // determine what the new price will be. 
    console.log("name =", this.name, ", quantity =", this.quantity, ", price =", this.price, 'RateofProd= ', this.rateOfProd );
  }

};

class Grain extends Resource {
  static name = "Grain";
  maxPrice = 17; // resource will not sell for more than this, this is price at quantity of one
  minPrice = 3; // will not sell for less, this is price at quantity = 1000
  rateOfProd = 2; // number of resources produced per tick
  price = 2; // the discrete price of buying one of this resource. 
  quantity = 1; // min of zero, max of 1000
  multiplier = 13; // scalar used to help determine how much rateOfProd can change per tick. 


}

class Steel extends Resource {
  static name = "Steel";
  maxPrice = 27; // resource will not sell for more than this, this is price at quantity of one
  minPrice = 7; // will not sell for less, this is price at quantity = 1000
  rateOfProd = 1; // number of resources produced per tick
  price = 7; // the discrete price of buying one of this resource. 
  quantity = 100; // min of zero, max of 1000
  multiplier = 7; // scalar used to help determine how much rateOfProd can change per tick. 

}

module.exports = {
  Grain,
  Steel,
  resourceMap,
}
