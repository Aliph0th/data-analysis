'use strict';

import { Component } from '../Component.js';
import { RECORDS_PER_PAGE } from '../constants.js';

export class TablePagination extends Component {
   constructor() {
      super();
   }
   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }

      const btnBack = this.createElement({
         type: 'button',
         classNames: ['btn'],
         innerText: 'Back'
      });
      const btnNext = this.createElement({
         type: 'button',
         classNames: ['btn'],
         innerText: 'Next'
      });
      const selectCountEl = this.createElement({
         type: 'select',
         classNames: ['control']
      });
      RECORDS_PER_PAGE.forEach(value => {
         const option = this.createElement({
            type: 'option',
            innerText: `${value} per page`,
            attributes: { value }
         });
         selectCountEl.appendChild(option);
      });
      rootElement.appendChild(
         this.createElement({
            type: 'div',
            classNames: ['pagination'],
            children: [btnBack, selectCountEl, btnNext]
         })
      );
   }
}
