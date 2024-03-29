'use strict';

import { Component } from './Component.js';
import { Table } from './table/Table.js';
import { TableFilter } from './table/TableFilter.js';
import { TablePagination } from './table/TablePagination.js';
import { fillAggregatedData, transformRecords } from '../helpers.js';
import { EVENTS, RECORDS_PER_PAGE } from '../constants.js';

export class App extends Component {
   #filterText = '';
   #pageOption = RECORDS_PER_PAGE[0];
   #page = 1;
   #prices;
   #root;
   #products;
   #records;
   constructor(records, prices, root) {
      super();
      this.#prices = prices;
      this.#root = root;
      this.#products = Object.keys(prices);
      this.#records = this.#getRecords(records);
      this.#addListeners();
   }

   get #filteredRecords() {
      return this.#records.filter(record =>
         record.company.toLowerCase().includes(this.#filterText)
      );
   }
   get #currentRecords() {
      let start = (this.#page - 1) * this.#pageOption;
      if (start > this.#records.length) {
         start = 0;
      }
      return this.#filteredRecords.slice(start, start + this.#pageOption);
   }
   get #pagesCount() {
      const array = this.#filterText ? this.#filteredRecords : this.#records;
      return Math.ceil(array.length / this.#pageOption);
   }

   #addListeners = () => {
      this.#bindListener(EVENTS.PAGINATION_CHANGE, e => {
         this.#pageOption = e.detail;
         if (this.#page > this.#pagesCount) {
            this.#page = this.#pagesCount;
         }
      });
      this.#bindListener(EVENTS.FILTER_CHANGE, e => {
         this.#page = 1;
         this.#filterText = e.detail.toLowerCase();
      });
      this.#bindListener(EVENTS.NEXT_PAGE, () => {
         if (this.#page >= this.#pagesCount) {
            return;
         }
         this.#page++;
      });
      this.#bindListener(EVENTS.PREV_PAGE, () => {
         if (this.#page < 0) {
            return;
         }
         this.#page--;
      });
      this.#bindListener(EVENTS.RENDER, this.render);
   };
   #bindListener = (type, fn) => {
      window.addEventListener(this._event(type, this.id), fn);
   };

   #getRecords = records => {
      const filteredData = records.filter(
         ({ company, product, count }) =>
            company && product && count > 0 && Number.isInteger(count)
      );
      const transformedData = transformRecords(filteredData, this.#prices);
      const filledMissingValues = transformedData.map(record => {
         this.#products.forEach(product => {
            record.products[product] ||= { count: 0, money: 0 };
         });
         return record;
      });
      return fillAggregatedData(filledMissingValues);
   };

   render = () => {
      this.#root.innerHTML = '';
      new TableFilter(this.#filterText, this.id).render(this.#root);
      if (!this.#currentRecords.length) {
         this.#root.appendChild(
            this._createElement({
               type: 'p',
               innerText: 'No records found 😢',
               classNames: ['muted']
            })
         );
         return;
      }
      new Table(
         this.#currentRecords,
         this.#products,
         `Page ${this.#page} of ${this.#pagesCount}`
      ).render(this.#root);
      new TablePagination(this.#pageOption, this.#page, this.#pagesCount, this.id).render(
         this.#root
      );
   };
}
