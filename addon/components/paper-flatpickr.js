import Component from '@ember/component';
import layout from '../templates/components/paper-flatpickr';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  layout,
  input: null,
  tagName: "",

  actions: {
    registerInput(input) {
      this.set('input', input);
    },
    unregisterInput() {
      this.set('input', null);
    },
    clear(){
      invokeAction(this.input, 'onChange', null);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this.set('input', null);
  }
});
