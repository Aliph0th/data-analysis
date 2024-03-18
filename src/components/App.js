'use strict';

import { Component } from '../Component.js';
import { Table } from './table/Table.js';
import { TableFilter } from './table/TableFilter.js';
import { TablePagination } from './table/TablePagination.js';
import { fillAggregatedData, transformRecords } from '../helpers.js';

export class App extends Component {
   constructor(records, prices) {
      super();
      this.prices = prices;
      this.products = Object.keys(prices);
      this.records = this.#getRecords(records);
      this.children = [
         new TableFilter(this.id),
         new Table(this.records, this.prices, this.products, this.id),
         new TablePagination(this.id)
      ];
      console.log(this.records);
   }

   #getRecords(records) {
      const filteredData = records.filter(
         ({ company, product, count }) =>
            company && product && count > 0 && Number.isInteger(count)
      );
      const transformedData = transformRecords(filteredData, this.prices);
      const filledMissingValues = transformedData.map(record => {
         this.products.forEach(product => {
            record.products[product] ||= { count: 0, money: 0 };
         });
         return record;
      });
      return fillAggregatedData(filledMissingValues);
   }

   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }
      this.children.forEach(child => child.render(rootElement));
   }
}
