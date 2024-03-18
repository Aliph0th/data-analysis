'use strict';
import { App } from './components/App.js';
import { PRODUCT_PRICES, generateData } from './generate.js';

const RECORDS_N = 110;
const prices = PRODUCT_PRICES;
const records = generateData(RECORDS_N);

const app = new App(records, prices, document.getElementById('root'));
app.render();
