'use strict';

import { Component } from '../Component.js';
import { Table } from './table/Table.js';
import { TableFilter } from './table/TableFilter.js';
import { TablePagination } from './table/TablePagination.js';
import { fillAggregatedData, transformRecords } from '../helpers.js';
import { EVENT_TYPES, RECORDS_PER_PAGE } from '../constants.js';

export class App extends Component {
   constructor(records, prices, root) {
      super();
      this.prices = prices;
      this.root = root;
      this.products = Object.keys(prices);
      this.records = this.#getRecords(records);
      this.filterText = '';
      this.pageOption = RECORDS_PER_PAGE[0];
      this.page = 0;
      this.#addListeners();
   }

   get #currentRecords() {
      return this.records.slice(
         this.page * this.pageOption,
         (this.page + 1) * this.pageOption
      );
   }

   get #pagesCount() {
      return Math.ceil(this.records.length / this.pageOption);
   }

   #addListeners() {
      // FIXME:
      window.addEventListener(this._event(EVENT_TYPES.PAGINATION_CHANGE, this.id), e => {
         this.pageOption = e.detail;
         this.render();
      });

      window.addEventListener(this._event(EVENT_TYPES.FILTER_CHANGE, this.id), e => {
         this.filterText = e.detail;
      });

      window.addEventListener(this._event(EVENT_TYPES.NEXT_PAGE, this.id), () => {
         if (this.page >= this.#pagesCount) {
            return;
         }
         this.page++;
         this.render();
      });

      window.addEventListener(this._event(EVENT_TYPES.PREV_PAGE, this.id), () => {
         if (this.page < 0) {
            return;
         }
         this.page--;
         this.render();
      });
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

   render() {
      this.root.innerHTML = '';
      new TableFilter(this.filterText, this.id).render(this.root);
      const pageText = `Page ${this.page + 1} of ${this.#pagesCount}`;
      new Table(
         this.#currentRecords,
         this.prices,
         this.products,
         pageText,
         this.id
      ).render(this.root);
      new TablePagination(this.pageOption, this.page, this.#pagesCount, this.id).render(
         this.root
      );
   }
}
