// the goal is to have no fractional JimCoins. 
class Resource {
  name;
  maxPrice; // resource will not sell for more than this, this is price at quantity of one
  minPrice; // will not sell for less, this is price at quantity = 1000
  rateOfProd; // number of resources produced per tick
  price; // the discrete price of buying one of this resource. 
  quantity; // prices are max at a quantity of 1, and minimized at a quantity of 1000
  multiplier; // scalar used to help determine how much rateOfProd can change per tick. Is the volatility of the resource in trading terms.  

  increaseMaxPrice() { // increases max price by 10% or 1, whichever is higher.  
    if (this.maxPrice * 1.1 > 1) {
      this.maxPrice = Math.floor(this.maxPrice * 1.1);
      return this.maxPrice;
    } else {
      this.maxPrice += 1;
      return this.maxPrice;
    }

  }
  increaseMinPrice() { // increases max price by 10% 
    if (this.minPrice * 1.1 > 1) {
      this.minPrice = Math.floor(this.minPrice * 1.1);
      return this.minPrice;
    } else {
      this.minPrice += 1;
      return this.minPrice;
    }
  }
  decreaseMaxPrice() {
    if (this.MaxPrice * .9 > 1) {
      this.maxPrice = Math.floor(this.maxPrice * .9);
      return this.maxPrice;
    } else {
      this.maxPrice -= 1;
      return this.maxPrice;
    }

  }
  decreaseMinPrice() {
    if (this.minPrice * .9 > 1) {
      this.minPrice = Math.floor(this.minPrice * .9);
      return this.minPrice;
    } else {
      this.minPrice -= 1;
      return this.minPrice;
    }
  }
  increaseMultiplier() {
    if (this.multiplier * 1.1 > 1) {
      this.multiplier = Math.floor(this.multiplier * 1.1);
      return this.multiplier;
    } else {
      this.multiplier += 1;
      return this.multiplier;
    }

  }
  decreaseMultiplier() {
    if(this.multiplier *.9 > 1){
      this.multiplier = Math.floor(this.multiplier * .9);
    return this.multiplier;
    }
    else{
      this.multiplier -= 1;
      return this.multiplier;
    }
  }

  productionRate() {
    if (this.quantity > 200 && this.quantity < 1200) { //essentially random increase, with an average of 5 more than zero between 200 and 1200
      this.rateOfProd = Math.floor(Math.sin(Math.random() * 2 * Math.PI) * this.multiplier + 5);
      return this.rateOfProd;
    }
    if (this.quantity > 1200) {  // with quantities higher than 1200, rate of production drops to 0. on a random number from 0-1 of higher than .8, remove up to 750 from quantity.
      let randomNum = Math.random();
      if (randomNum > .8) {
        this.rateOfProd = Math.floor(Math.random() * -750);
        this.increaseMaxPrice();
        this.increaseMinPrice();
        return this.rateOfProd;
      }
      return this.rateOfProd = 0;
    }
    else { //slow, positive growth before quantity of 200
      this.rateOfProd = Math.floor(Math.random() * this.multiplier);
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
    // console.log("name =", this.name, ", quantity =", this.quantity, ", price =", this.price, 'MaxPrice', this.maxPrice);
  }

};

class Grain extends Resource {
  name = "Grain";
  maxPrice = 17; // resource will not sell for more than this, this is price at quantity of one
  minPrice = 3; // will not sell for less, this is price at quantity = 1000
  rateOfProd = 2; // number of resources produced per tick
  price = 2; // the discrete price of buying one of this resource. 
  quantity = 1; // min of zero, max of 1000
  multiplier = 13; // scalar used to help determine how much rateOfProd can change per tick. 
}

class Steel extends Resource {
  name = "Steel";
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
}
