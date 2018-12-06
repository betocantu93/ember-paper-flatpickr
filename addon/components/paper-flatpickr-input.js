import PaperInput from "ember-paper/components/paper-input";

import FlatpickrMixin from "ember-flatpickr/mixins/flatpickr";
import diffAttrs from "ember-diff-attrs";
import { invokeAction } from "ember-invoke-action";
import { assert } from "@ember/debug";
import { assign } from "@ember/polyfills";
import { run } from "@ember/runloop";
import { getOwner } from "@ember/application";

export default PaperInput.extend(FlatpickrMixin, {
  didInsertElement() {
    this._super(...arguments);
    let field = this.element.querySelector("input");
    invokeAction(this, "registerInput", this);
    this.set("field", field);
    this.setupFlatpickr();
  },

  focusOut() {
    this.set('focused', this.flatpickrRef.isOpen)
  },

  setupFlatpickr() {
    // Require that users pass a date
    assert(
      "{{ember-flatpickr}} requires a `date` to be passed as the value for flatpickr.",
      this.get("date") !== undefined
    );

    // Require that users pass an onChange
    assert(
      "{{ember-flatpickr}} requires an `onChange` action or null for no action.",
      this.get("onChange") !== undefined
    );

    // Pass all values and setup flatpickr
    run.scheduleOnce("afterRender", this, function() {
      const fastboot = getOwner(this).lookup("service:fastboot");
      if (fastboot && fastboot.isFastBoot) {
        return;
      }
      const options = this.getProperties(Object.keys(this.attrs));

      // Add defaultDate, change and close handlers
      assign(options, {
        inline: this.inline || options.inline,
        defaultDate: this.get("value"),
        onChange: this._onChange.bind(this),
        onClose: this._onClose.bind(this),
        onOpen: this._onOpen.bind(this),
        onReady: this._onReady.bind(this)
      });

      const flatpickrRef = flatpickr(this.field, options);

      if (this.get("appendDataInput")) {
        this.field.setAttribute("data-input", "");
      }

      this._setDisabled(this.get("disabled"));

      this.set("flatpickrRef", flatpickrRef);
    });
  },

  didReceiveAttrs: diffAttrs(
    "altFormat",
    "value",
    "disabled",
    "locale",
    "maxDate",
    "minDate",
    function(changedAttrs, ...args) {
      this._super(...args);

      this._attributeHasChanged(changedAttrs, "altFormat", newAltFormat => {
        this.field._flatpickr.set("altFormat", newAltFormat);
      });

      this._attributeHasChanged(changedAttrs, "value", newValue => {
        if (typeof newValue !== "undefined") {
          this.field._flatpickr.setDate(newValue);
        }
      });

      this._attributeHasChanged(changedAttrs, "disabled", newDisabled => {
        if (typeof newDisabled !== "undefined") {
          this._setDisabled(newDisabled);
        }
      });

      this._attributeHasChanged(changedAttrs, "locale", () => {
        this.field._flatpickr.destroy();
        this.setupComponent();
      });

      this._attributeHasChanged(changedAttrs, "maxDate", newMaxDate => {
        this.field._flatpickr.set("maxDate", newMaxDate);
      });

      this._attributeHasChanged(changedAttrs, "minDate", newMinDate => {
        this.field._flatpickr.set("minDate", newMinDate);
      });
    }
  ),
  _attributeHasChanged(changedAttrs, attr, callback) {
    if (changedAttrs && changedAttrs[attr]) {
      const [oldAttr, newAttr] = changedAttrs[attr];
      if (oldAttr !== newAttr) {
        callback(newAttr);
      }
    }
  },

  _onChange(selectedDates, dateStr, instance) {
    //let handleInput emit onChange
  },

  _onOpen(selectedDates, dateStr, instance) {
    invokeAction(this, "onOpen", selectedDates, dateStr, instance);
    this.set("isTouched", true);
    this.notifyValidityChange();
  },
  _onClose(selectedDates, dateStr, instance) {
    if (this.mode === "range" && selectedDates.length < 2) {
      invokeAction(this, "onChange", null);
    }
    this.set('focused', this.flatpickrRef.isOpen)
    invokeAction(this, "onClose", selectedDates, dateStr, instance);
    this.set("isTouched", true);
    this.notifyValidityChange();
  },

  actions: {

    clear(e) {
      this.set("isTouched", true);
      this.notifyValidityChange();
      this.field._flatpickr.clear();
    },

    handleInput(e) {
      let flatpickr = this.field._flatpickr;
      
      invokeAction(
        this,
        "onChange",
        flatpickr.selectedDates,
        flatpickr.altInput.value || flatpickr.input.value,
        flatpickr
      );
      // setValue below ensures that the input value is the same as this.value
      run.next(() => {
        if (this.isDestroyed) {
          return;
        }
        this.setValue(this.get("value"));
      });
      this.growTextarea();
      let inputElement = this.element.querySelector("input");
      this.set(
        "isNativeInvalid",
        inputElement && inputElement.validity && inputElement.validity.badInput
      );
      this.notifyValidityChange();
    }
  },
  willDestroyElement() {
    this._super(...arguments);
    invokeAction(this, "unregisterInput");
  }
});
