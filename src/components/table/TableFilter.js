'use strict';

import { Component } from '../../Component.js';

export class TableFilter extends Component {
   constructor(parentID) {
      super();
      this.parentID = parentID;
   }
   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }
      const input = this._createElement({
         type: 'input',
         classNames: ['control'],
         attributes: { placeholder: 'Filter by company name' }
      });
      rootElement.appendChild(input);
   }
}
