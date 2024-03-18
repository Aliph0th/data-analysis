'use strict';

import { Component } from '../../Component.js';
import { EVENT_TYPES, RECORDS_PER_PAGE } from '../../constants.js';

export class TablePagination extends Component {
   constructor(parentID) {
      super();
      this.parentID = parentID;
   }
   #nextBtnPressed = () => {
      this._dispatch(EVENT_TYPES.NEXT_PAGE, this.parentID);
   };
   #backBtnPressed = () => {
      this._dispatch(EVENT_TYPES.PREV_PAGE, this.parentID);
   };
   #paginationChanged = e => {
      this._dispatch(EVENT_TYPES.PAGINATION_CHANGE, this.parentID, +e.target.value);
   };
   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }

      const btnBack = this._createElement({
         type: 'button',
         classNames: ['btn'],
         innerText: 'Back'
      });
      const btnNext = this._createElement({
         type: 'button',
         classNames: ['btn'],
         innerText: 'Next'
      });
      const selectCountEl = this._createElement({
         type: 'select',
         classNames: ['control']
      });
      RECORDS_PER_PAGE.forEach(value => {
         const option = this._createElement({
            type: 'option',
            innerText: `${value} per page`,
            attributes: { value }
         });
         selectCountEl.appendChild(option);
      });
      rootElement.appendChild(
         this._createElement({
            type: 'div',
            classNames: ['pagination'],
            children: [btnBack, selectCountEl, btnNext]
         })
      );

      btnNext.addEventListener('click', this.#nextBtnPressed);
      btnBack.addEventListener('click', this.#backBtnPressed);
      selectCountEl.addEventListener('change', this.#paginationChanged);
   }
}
