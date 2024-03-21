'use strict';

import { EVENTS } from '../constants.js';

export class Component {
   constructor() {
      this.id = Math.random().toString(36).substring(2, 10);
   }
   _createElement({
      type,
      classNames = [],
      innerText = '',
      children = [],
      attributes = {}
   }) {
      const element = document.createElement(type);
      element.innerText = innerText;
      if (classNames.length) {
         element.className = classNames.join(' ');
      }
      if (children.length) {
         element.append(...children);
      }
      Object.entries(attributes).forEach(([key, value]) => {
         element.setAttribute(key, value);
      });
      return element;
   }
   _event(name, id) {
      return `${name}_${id}`;
   }
   _dispatch(eventName, id, detail) {
      window.dispatchEvent(new CustomEvent(this._event(eventName, id), { detail }));
      window.dispatchEvent(new Event(this._event(EVENTS.RENDER, id)));
   }
}
