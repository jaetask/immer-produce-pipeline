# Immer produce pipe

> Pipe's an array of producer functions through `immer` producer


## Install
```js
npm i -S immer immer-produce-pipe
```
> Prerequisite: Requires [Immer](https://immerjs.github.io/immer/docs/introduction) to be pre-installed as a dependency

## Usage
```js
import producePipe from 'immer-produce-pipe'
```
## Advantages
Using a pipeline is a good practice when processing data, each function is small, easily testable and immutable. This provides pure consistent results. Same input and pipeline = same output.

## Example

Create some functions to use
```js

const percentageDiscount = discount => draft => {
  draft.discounted = false
  draft.pricePostDiscount = draft.price
  if (draft.dicountable === 1) {
    draft.discounted = true
    draft.pricePostDiscount = draft.price * (1 - discount)
  }
  draft.discount = draft.price - draft.pricePostDiscount
}

const vat = draft => {
  draft.vat = draft.pricePostDiscount * draft.vatRate
  draft.priceIncVat = draft.pricePostDiscount + draft.vat
}
```

Build a pipeline
```js
// just an array of functions, 
// so you could push items onto the pipeline using logic or whatever

const pipeline = [percentageDiscount(0.05), vat]

```

Now process some product data
```js
const products = [
  { price: 110, vatRate: 0.05, dicountable: 0 },
  { price: 37.5, vatRate: 0.2, dicountable: 1 },
  { price: 987, vatRate: 0.2, dicountable: 1 }
]

const processedProducts = producePipe(pipeline)

products.map(processedProducts)
```

Result
```json
[
  { 
    "price": 110,
    "vatRate": 0.05,
    "dicountable": 0,
    "discounted": false,
    "pricePostDiscount": 110,
    "discount": 0,
    "vat": 5.5,
    "priceIncVat": 115.5
  },
  {
    "price": 37.5,
    "vatRate": 0.2,
    "dicountable": 1,
    "discounted": true,
    "pricePostDiscount": 35.625,
    "discount": 1.875,
    "vat": 7.125,
    "priceIncVat": 42.75
  },
  {
    "price": 987,
    "vatRate": 0.2,
    "dicountable": 1,
    "discounted": true,
    "pricePostDiscount": 937.65,
    "discount": 49.35000000000002,
    "vat": 187.53,
    "priceIncVat": 1125.18
  }
]
```

