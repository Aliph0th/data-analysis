'use strict';

import { Component } from '../Component.js';

export class TableFilter extends Component {
   constructor() {
      super();
   }
   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }
      const input = this.createElement({
         type: 'input',
         classNames: ['control'],
         attributes: { placeholder: 'Filter by company name' }
      });
      rootElement.appendChild(input);
   }
}
