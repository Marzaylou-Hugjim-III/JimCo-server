// the goal is to have no fractional JimCoins. 
class Resource {
  constructor(maxPrice, minPrice, rateOfProd, price, quantity, multiplier){
    this.maxPrice = maxPrice; // resource will not sell for more than this, this is price at quantity of one
    this.minPrice = minPrice; // will not sell for less, this is price at quantity = 1000
    this.rateOfProd = rateOfProd; // number of resources produced per tick
    this.price= price; // the discrete price of buying one of this resource. 
    this.quantity = quantity; // min of zero, max of 1000
    this.multiplier = multiplier; // scalar used to help determine how much rateOfProd can change per tick. 
  }
};

const Grain = new Resource(17, 3, 2, 2, 1, 13);
 

const productionRate= (resource) => {
  resource.rateOfProd = Math.floor(Math.random()*resource.multiplier);
  return resource.rateOfProd;
};

const price = (resource) =>{
  resource.price = ((resource.maxPrice-resource.minPrice)/(1000))*resource.quantity+resource.minPrice;
  console.log("isNAN3", isNaN(resource.price));
  if(resource.price > resource.maxPrice){
    resource.price = resource.maxPrice;
  }
  if( resource.price < resource.minPrice){
    resource.price = resource.minPrice;
  } 
  return Math.round(resource.price);
};

const quantity = (resource) => {
  resource.quantity = resource.quantity + productionRate(resource, resource.rateOfProd);
}


const loop = (resource) =>{
  productionRate(resource); // determine what the amount produced will be
  quantity(resource); // determine what the new amount will be
  price(resource); // determine what the new price will be. 
}
console.log("before loop", Grain);

loop(Grain);
console.log("post loop",Grain);

module.exports = Resource
