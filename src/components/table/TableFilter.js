'use strict';

import { Component } from '../../Component.js';
import { EVENT_TYPES } from '../../constants.js';

export class TableFilter extends Component {
   constructor(filter, parentID) {
      super();
      this.filter = filter;
      this.parentID = parentID;
   }
   #filterChanged = e => {
      this._dispatch(EVENT_TYPES.FILTER_CHANGE, this.parentID, e.target.value);
   };
   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }
      const input = this._createElement({
         type: 'input',
         classNames: ['control'],
         attributes: { placeholder: 'Filter by company name', value: this.filter }
      });
      rootElement.appendChild(input);

      input.addEventListener('input', this.#filterChanged);
   }
}
