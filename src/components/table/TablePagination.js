'use strict';
export class TablePagination {
   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }
      const p = document.createElement('p');
      p.innerText = 'pagination';
      rootElement.appendChild(p);
   }
}
