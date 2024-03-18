'use strict';
import { App } from './components/App.js';
import { PRODUCT_PRICES, generateData } from './generate.js';

const RECORDS_N = 15;
const prices = PRODUCT_PRICES;
const records = generateData(RECORDS_N);

console.log(records);
console.log(prices);

const app = new App(records, prices);
app.render(document.getElementById('root'));
