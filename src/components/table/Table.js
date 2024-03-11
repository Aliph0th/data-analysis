'use strict';
export class Table {
   constructor(records, prices) {
      this.records = this.#getValidRecords(records);
      this.prices = prices;
   }

   #getValidRecords(records) {
      return records;
   }

   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }
      const tableElement = document.createElement('table');
      const tBody = document.createElement('tbody');
      const tHead = document.createElement('thead');
      tableElement.append(tHead, tBody);
      tableElement.className = 'table';

      for (const header of ['Компания', ...Object.keys(this.prices)]) {
         const thEl = document.createElement('th');
         thEl.innerText = header;
         tHead.appendChild(thEl);
      }

      for (const record of this.records) {
         const rowEl = document.createElement('tr');
         Object.entries(record).forEach(([key, value]) => {
            const colEl = document.createElement('td');
            colEl.innerText = `${key}: ${value}`;
            rowEl.appendChild(colEl);
         });
         tBody.appendChild(rowEl);
      }
      rootElement.appendChild(tableElement);
   }
}
