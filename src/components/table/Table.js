'use strict';

import { TableFilter } from './TableFilter.js';
import { TablePagination } from './TablePagination.js';

const filterComponent = new TableFilter();
const paginationComponent = new TablePagination();

export class Table {
   constructor(records, prices) {
      this.prices = prices;
      this.tableHeaders = this.#createTableHeaders(prices);
      this.records = this.#getValidRecords(records);
      console.log(this.records);
   }

   #createTableHeaders(prices) {
      const headers = [];
      Object.keys(prices).forEach(product => {
         headers.push(product + '(шт)');
         headers.push(product + '(руб)');
      });
      return headers;
   }

   #getValidRecords(records) {
      const filteredData = records.filter(
         ({ company, product, count }) =>
            company && product && count > 0 && Number.isInteger(count)
      );
      const transformedRecords = this.#transformRecords(filteredData);
      return transformedRecords.map(record => {
         this.tableHeaders.forEach(product => {
            record.data[product] ??= 0;
         });
         return record;
      });
   }

   #transformRecords(records) {
      const transformedData = records.reduce((accum, record) => {
         const { company, product, count } = record;

         const reducedRecord = accum.find(record => record.company === company);
         const recordHeader = this.tableHeaders.findIndex(header =>
            header.startsWith(product)
         );
         // FIXME: please
         if (reducedRecord) {
            reducedRecord.data[this.tableHeaders[recordHeader]] =
               (reducedRecord.data[this.tableHeaders[recordHeader]] || 0) + count;
            reducedRecord.data[this.tableHeaders[recordHeader + 1]] =
               (reducedRecord.data[this.tableHeaders[recordHeader] + 1] || 0) +
               +(count * this.prices[product]).toFixed(2);
         } else {
            accum.push({
               company,
               data: {
                  [this.tableHeaders[recordHeader]]: count,
                  [this.tableHeaders[recordHeader + 1]]: +(
                     count * this.prices[product]
                  ).toFixed(2)
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
      const captionElement = document.createElement('caption');
      const tHeadElement = document.createElement('thead');
      const tBodyElement = document.createElement('tbody');
      const headerRowEl = document.createElement('tr');
      tHeadElement.appendChild(headerRowEl);
      tableElement.append(captionElement, tHeadElement, tBodyElement);
      tableElement.className = 'table';
      captionElement.innerText = 'Page 1 of 10';

      this.#renderTableCell('Компания', headerRowEl, 'th');
      for (const header of this.tableHeaders) {
         this.#renderTableCell(
            header[0].toUpperCase() + header.slice(1),
            headerRowEl,
            'th'
         );
      }

      for (const record of this.records) {
         const rowEl = document.createElement('tr');
         this.#renderTableCell(record.company, rowEl);
         this.tableHeaders.forEach(product => {
            this.#renderTableCell(record.data[product], rowEl);
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
