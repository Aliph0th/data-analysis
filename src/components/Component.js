export class Component {
   constructor() {
      this.id = Math.random().toString(36).substring(2, 10);
   }
   createElement({
      type,
      classNames = [],
      innerText = '',
      children = [],
      attributes = {}
   }) {
      const element = document.createElement(type);
      if (classNames.length) {
         element.className = classNames.join(' ');
      }
      if (innerText) {
         element.innerText = innerText;
      }
      if (children.length) {
         element.append(...children);
      }
      Object.entries(attributes).forEach(([key, value]) => {
         element.setAttribute(key, value);
      });
      return element;
   }
}
