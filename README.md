# ember-paper-flatpickr

Enhance ember-paper paper-input with ember-flatpickr, this addon depends on ember-paper and ember-flatpickr.

To get stuff like form validations, `ember-paper` styles, etc...

You can check the `paper-input` options in `ember-paper` docs and `flatpickr` options in `ember-flatpickr` or flatpickr.js.org

There are some caveats, currently the events like onFocus or onBlur used for normal `ember-paper` `paper-input`
does not work if we use the `flatpickr` option `altInput=true` because `flatpickr` creates a new input and hides the
`ember-paper` `paper-input`.

Apart from that, you can pass all options to `flatpickr` and `paper-input`.

Currently this addon is using a fork of `ember-flatpickr`.

## Installation

Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-paper-flatpickr
```

## Usage

If you want to `allowClear` you need to wrap like this the `paper-flatpickr-input` and pass down the `allowClear` to the wrapper which yields the input
Any `template.hbs`, you should pass all the `paper-input` options and `flatpickr` options to the `paper-flatpickr-input` or via the yielded `Flatpickr.input`

```
    <PaperFlatpickr @allowClear={{true}} class="flex" as |Flatpickr|>
        <Flatpickr.input
            @disableMobile={{true}}
            @allowInput={{false}}
            @altInput={{true}}
            @appendDataInput={{false}}
            @classNames={{classString}}
            @format="MMMM D, YYYY"
            @value={{readonly dateSelected}}
            @required={{true}}
            @enableTime={{false}}
            @onChange={{action (mut dateSelected)}}
            @locale="es"
            @label="otherheyeh"
            @placeholder="Heyhey"
            @enableTime={{true}}
        />
    </PaperFlatpickr>
```

If you don't care about `allowClear` you can just use the `paper-flatpickr-input` directly

```
    <PaperFlatpickrInput
        @disableMobile={{true}}
        @allowInput={{false}}
        @altInput={{true}}
        @appendDataInput={{false}}
        @classNames={{classString}}
        @format="MMMM D, YYYY"
        @value={{readonly dateSelected}}
        @required={{true}}
        @enableTime={{false}}
        @onChange={{action (mut dateSelected)}}
        @locale="es"
        @label="otherheyeh"
        @placeholder="Heyhey"
        @enableTime={{true}}
    />
```
## Contributing

### Installation

- `git clone <repository-url>`
- `cd ember-paper-flatpickr`
- `npm install`

### Linting

- `npm run lint:hbs`
- `npm run lint:js`
- `npm run lint:js -- --fix`

### Running tests

- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

- `ember serve`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).
See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
