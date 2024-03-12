'use strict';
export class TableFilter {
   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }
      const input = document.createElement('input');
      input.className = 'control';
      input.placeholder = 'Filter by company name';
      rootElement.appendChild(input);
   }
}
