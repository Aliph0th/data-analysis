'use strict';

import { Component } from '../../Component.js';
import { EMPTY_METRIC, METRICS_NAMES } from '../../constants.js';
import {
   createTableHeaders,
   formatNumber,
   getDataForMetrics,
   median
} from '../../helpers.js';

export class Table extends Component {
   constructor(records, prices, products, pageText, parentID) {
      super();
      this.parentID = parentID;
      this.prices = prices;
      this.products = products;
      this.records = records;
      this.tableHeaders = createTableHeaders(this.products);
      this.metrics = this.#calculateMetrics();
      this.pageText = pageText;
   }

   #calculateMetrics() {
      const mappedData = getDataForMetrics(this.records, this.products);
      const maxMetric = Object.entries(mappedData).reduce((accum, [key, value]) => {
         accum[key] = Math.max(...value);
         return accum;
      }, {});
      const sumMetric = Object.entries(mappedData).reduce((accum, [key, value]) => {
         accum[key] = formatNumber(value.reduce((sum, x) => sum + x, 0));
         return accum;
      }, {});
      const avgMetric = Object.entries(mappedData).reduce((accum, [key]) => {
         accum[key] = formatNumber(sumMetric[key] / this.records.length);
         return accum;
      }, {});
      const medianMetric = Object.entries(mappedData).reduce((accum, [key, value]) => {
         accum[key] = formatNumber(median(value));
         return accum;
      }, {});

      return [
         { name: METRICS_NAMES.MAX, data: maxMetric },
         { name: METRICS_NAMES.SUM, data: sumMetric },
         { name: METRICS_NAMES.AVG, data: avgMetric },
         { name: METRICS_NAMES.MEDIAN, data: medianMetric }
      ];
   }

   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }

      const tHeadElement = this._createElement({ type: 'thead' });
      const tBodyElement = this._createElement({ type: 'tbody' });
      const tableElement = this._createElement({
         type: 'table',
         classNames: ['table'],
         children: [tHeadElement, tBodyElement]
      });
      rootElement.append(
         this._createElement({
            type: 'p',
            classNames: ['page_title'],
            innerText: this.pageText
         }),
         this._createElement({
            type: 'div',
            classNames: ['table_container'],
            children: [tableElement]
         })
      );

      this.#createRow(this.tableHeaders, tHeadElement, 'th');

      for (const record of this.records) {
         const rowData = this.products.reduce(
            (accum, product) => {
               accum.push(...Object.values(record.products[product]));
               return accum;
            },
            [record.company]
         );
         this.#createRow(
            [...rowData, record.totalMoney, record.purchasePercentage],
            tBodyElement
         );
      }

      for (const { name, data } of this.metrics) {
         const rowData = [name];
         this.products.forEach(product => {
            rowData.push(data[product], EMPTY_METRIC);
         });
         this.#createRow(
            [...rowData, data.totalMoney, data.purchasePercentage],
            tBodyElement,
            'td',
            true
         );
      }
   }

   #createRow(rowData, parent, cellType = 'td', isMetric = false) {
      const classNames = isMetric ? ['metric'] : [];
      const rowElement = this._createElement({ type: 'tr', classNames });
      rowData.forEach(x => {
         rowElement.appendChild(
            this._createElement({
               type: cellType,
               innerText: x
            })
         );
      });
      parent.appendChild(rowElement);
   }
}
