'use strict';

import { TableFilter } from './TableFilter.js';
import { TablePagination } from './TablePagination.js';

const filterComponent = new TableFilter();
const paginationComponent = new TablePagination();

export class Table {
   constructor(records, prices) {
      this.prices = prices;
      this.tableHeaders = this.#createTableHeaders();
      this.records = this.#getValidRecords(records);
      this.totalMoney = this.#calculateTotalMoney();
      console.log(this.totalMoney);
      this.pageText = 'Page 1 of 10';
      console.log(this.records);
   }

   #createTableHeaders() {
      const headers = [];
      Object.keys(this.prices).forEach(product => {
         headers.push(product + '(шт)');
         headers.push(product + '(руб)');
      });
      return [...headers, 'Итого(руб)'];
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
         const money = +(count * this.prices[product]).toFixed(2);
         if (reducedRecord) {
            reducedRecord.products[product] = this.#calculateProductData(
               count,
               money,
               reducedRecord.products[product] || [0, 0]
            );
         } else {
            accum.push({
               company,
               products: {
                  [product]: this.#calculateProductData(count, money)
               }
            });
         }

         return accum;
      }, []);
      return transformedData;
   }

   #calculateProductData(count, money, previousData = [0, 0]) {
      return [previousData[0] + count, +(previousData[1] + money).toFixed(2)];
   }

   #calculateTotalMoney() {
      return this.records.reduce((accum, record) => {
         const { company, products } = record;
         accum[company] = Object.values(products).reduce((money, productData) => {
            return +(money + productData[1]).toFixed(2);
         }, 0);
         return accum;
      }, {});
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
         const rowData = [record.company];
         Object.keys(this.prices).forEach(product => {
            rowData.push(...record.products[product]);
         });
         const rowElement = this.#buildTableRow([
            ...rowData,
            this.totalMoney[record.company]
         ]);
         tBodyElement.appendChild(rowElement);
      }
   }

   #buildTableRow(rowData) {
      const rowElement = this.#createElement({ type: 'tr' });
      rowData.forEach(x => {
         rowElement.appendChild(
            this.#createElement({
               type: 'td',
               innerText: x
            })
         );
      });
      return rowElement;
   }

   #createElement({ type, classNames = [], innerText = '', children = [] }) {
      const element = document.createElement(type);
      element.className = classNames.join(' ');
      element.innerText = innerText;
      element.append(...children);
      return element;
   }
}
