import { Table } from './components/table/Table.js';
import { PRODUCT_PRICES, generateData } from './generate.js';

const RECORDS_N = 10;
const prices = PRODUCT_PRICES;
const records = generateData(RECORDS_N);
const root = document.getElementById('root');

console.table(records);
console.log(prices);

const tableComponent = new Table(records);
tableComponent.render(root);
