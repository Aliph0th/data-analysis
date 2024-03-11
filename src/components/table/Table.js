'use strict';

import { TableFilter } from './TableFilter.js';
import { TablePagination } from './TablePagination.js';

const filterComponent = new TableFilter();
const paginationComponent = new TablePagination();

export class Table {
   constructor(records, prices) {
      this.prices = prices;
      this.records = this.#getValidRecords(records);
      this.tableHeaders = ['company', ...Object.keys(prices)];
   }

   #getValidRecords(records) {
      const filteredData = records.filter(
         ({ company, product, count }) =>
            company && product && count > 0 && Number.isInteger(count)
      );
      const transformedRecords = this.#transformRecords(filteredData);
      return transformedRecords.map(record => {
         Object.keys(this.prices).forEach(product => {
            record.products[product] ??= 0;
         });
         return record;
      });
   }

   #transformRecords(records) {
      const transformedData = records.reduce((accum, record) => {
         const { company, product, count } = record;

         const reducedRecord = accum.find(record => record.company === company);
         if (reducedRecord) {
            reducedRecord.products[product] =
               (reducedRecord.products[product] || 0) + count;
         } else {
            accum.push({
               company,
               products: {
                  [product]: count
               }
            });
         }

         return accum;
      }, []);
      return transformedData;
   }

   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }

      filterComponent.render(rootElement);

      const tableElement = document.createElement('table');
      const tBodyElement = document.createElement('tbody');
      const tHeadElement = document.createElement('thead');
      const headerRowEl = document.createElement('tr');
      tHeadElement.appendChild(headerRowEl);
      tableElement.append(tHeadElement, tBodyElement);
      tableElement.className = 'table';

      for (const header of this.tableHeaders) {
         this.#renderTableCell(header[0].toUpperCase() + header.slice(1), headerRowEl, 'th');
      }

      for (const record of this.records) {
         const rowEl = document.createElement('tr');
         this.#renderTableCell(record.company, rowEl);
         Object.keys(this.prices).forEach(product => {
            this.#renderTableCell(record.products[product], rowEl);
         });
         tBodyElement.appendChild(rowEl);
      }
      rootElement.appendChild(tableElement);

      paginationComponent.render(rootElement);
   }

   #renderTableCell(text, parent, type = 'td') {
      const element = document.createElement(type);
      element.innerText = text;
      parent.appendChild(element);
   }
}
