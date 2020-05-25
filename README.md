# Immer produce pipeline

> Pipe's an array of producer functions through `immer` producer


## Install
```js
npm i -S immer immer-produce-pipeline
```
> Prerequisite: Requires [Immer](https://immerjs.github.io/immer/docs/introduction) to be pre-installed as a dependency

## Usage
```js
import producePipe from 'immer-produce-pipe'
```
## Advantages
Using a pipeline is a good practice when processing data, each function is small, easily testable and immutable. This provides pure consistent results. Same input and pipeline = same output.

## Example
In this example we are going to apply a percentage discount and then calculate vat for some products.

First we create our pipeline functions
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

Then we will build our pipeline, to run against each product
```js
// A pipeline is just an array of functions wrapped in producers
const pipeline = producePipe([percentageDiscount(0.05), vat])

const products = [
  { price: 110, vatRate: 0.05, dicountable: 0 },
  { price: 37.5, vatRate: 0.2, dicountable: 1 },
  { price: 987, vatRate: 0.2, dicountable: 1 }
]

// run the pipeline against each product
const processed = products.map(pipeline)
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

