'use strict';

import { Component } from '../Component.js';
import { EVENTS, RECORDS_PER_PAGE } from '../../constants.js';

export class TablePagination extends Component {
   #option;
   #page;
   #pagesCount;
   #parentID;
   constructor(option, page, pagesCount, parentID) {
      super();
      this.#option = option;
      this.#page = page;
      this.#pagesCount = pagesCount;
      this.#parentID = parentID;
   }

   #nextBtnPressed = () => {
      this._dispatch(EVENTS.NEXT_PAGE, this.#parentID);
   };
   #backBtnPressed = () => {
      this._dispatch(EVENTS.PREV_PAGE, this.#parentID);
   };
   #paginationChanged = e => {
      this._dispatch(EVENTS.PAGINATION_CHANGE, this.#parentID, +e.target.value);
   };

   render = rootElement => {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }

      const btnBack = this._createElement({
         type: 'button',
         classNames: ['btn'],
         innerText: 'Back',
         attributes: { disabled: this.#page === 1 }
      });
      const btnNext = this._createElement({
         type: 'button',
         classNames: ['btn'],
         innerText: 'Next',
         attributes: { disabled: this.#page === this.#pagesCount }
      });
      const selectCountEl = this._createElement({
         type: 'select',
         classNames: ['control']
      });
      RECORDS_PER_PAGE.forEach(value => {
         const option = this._createElement({
            type: 'option',
            innerText: `${value} per page`,
            attributes: { value, selected: this.#option === value }
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
   };
}
