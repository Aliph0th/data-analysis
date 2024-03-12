'use strict';
export class TablePagination {
   render(rootElement) {
      if (!rootElement) {
         throw new Error('root element is not specified');
      }
      const div = document.createElement('div');
      // ? TODO: buttons as properties
      const btnBack = document.createElement('button');
      const btnNext = document.createElement('button');
      const selectCountEl = document.createElement('select');
      [10, 50, 100].forEach(value => { // TODO: do smth with array
         const option = document.createElement('option');
         option.value = value;
         option.innerText = `${value} per page`;
         selectCountEl.appendChild(option);
      });

      btnBack.innerText = 'Back';
      btnNext.innerText = 'Next';
      btnBack.className = 'btn';
      btnNext.className = 'btn';
      selectCountEl.className = 'control';

      div.className = 'pagination';
      div.append(btnBack, selectCountEl, btnNext);
      rootElement.appendChild(div);
   }
}
