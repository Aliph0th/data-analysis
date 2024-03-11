'use strict';
export class TableFilter {
   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }
      const p = document.createElement('p');
      p.innerText = 'filter';
      rootElement.appendChild(p);
   }
}
