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
      this.pageText = 'Page 1 of 10';
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
      const transformedData = this.#transformRecords(filteredData);
      return transformedData.map(record => {
         Object.keys(this.prices).forEach(product => {
            record.products[product] ||= [0, 0];
         });
         return record;
      });
   }

   #transformRecords(records) {
      const transformedData = records.reduce((accum, record) => {
         const { company, product, count } = record;

         const reducedRecord = accum.find(record => record.company === company);
         const additionPrice = +(count * this.prices[product]).toFixed(2);
         if (reducedRecord) {
            reducedRecord.products[product] = this.#calculateProductData(
               count,
               additionPrice,
               reducedRecord.products[product] || [0, 0]
            );
         } else {
            accum.push({
               company,
               products: {
                  [product]: this.#calculateProductData(count, additionPrice)
               }
            });
         }

         return accum;
      }, []);
      return transformedData;
   }

   #calculateProductData(count, price, previousData = [0, 0]) {
      return [previousData[0] + count, +(previousData[1] + price).toFixed(2)];
   }

   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }

      filterComponent.render(rootElement);

      const tHeadRow = this.#createElement({
         type: 'tr'
      });
      const tBodyElement = this.#createElement({
         type: 'tbody'
      });
      const tableElement = this.#createElement({
         type: 'table',
         classNames: ['table'],
         children: [
            this.#createElement({
               type: 'thead',
               children: [tHeadRow]
            }),
            tBodyElement
         ]
      });
      rootElement.append(
         this.#createElement({
            type: 'p',
            classNames: ['page_title'],
            innerText: this.pageText
         }),
         this.#createElement({
            type: 'div',
            classNames: ['table_container'],
            children: [tableElement]
         })
      );

      paginationComponent.render(rootElement);

      for (const header of ['Компания', ...this.tableHeaders]) {
         tHeadRow.appendChild(
            this.#createElement({
               type: 'th',
               innerText: header
            })
         );
      }

      for (const record of this.records) {
         const rowEl = this.#createElement({ type: 'tr' });
         rowEl.appendChild(
            this.#createElement({
               type: 'td',
               innerText: record.company
            })
         );
         Object.keys(this.prices).forEach(product => {
            rowEl.append(
               ...record.products[product].map(x => {
                  return this.#createElement({
                     type: 'td',
                     innerText: x
                  });
               })
            );
         });
         tBodyElement.appendChild(rowEl);
      }
   }

   #createElement({ type, classNames = [], innerText = '', children = [] }) {
      const element = document.createElement(type);
      element.className = classNames.join(' ');
      element.innerText = innerText;
      element.append(...children);
      return element;
   }
}
