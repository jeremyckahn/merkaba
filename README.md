# Merkaba

### An SVG editor component written in React

## Milestone 1 tasks

This project is early in development and not useful yet, but you can play with the current snapshot here: https://jeremyckahn.github.io/merkaba/

This is the current roadmap:

- [x] Stand up basic environment layout/structure similar to [Vectr](https://vectr.com/new)
- [ ] Layer reordering
- [x] Initial primitives support: Rectangles
    - [x] Drag-and-drop:
        - [x] Creation
        - [x] Repositioning
        - [x] Rotation/scaling
    - [x] Detail manipulation:
        - [x] Direct positional/display value editing
        - [x] Color selection via color picker element
        - [x] Stroke/fill support
- [ ] Undo/redo support
- [ ] Oher tools
    - [ ] Rectangle select
        - [ ] Grouping support
- [ ] Keyboard shortcuts/keybindings
    - [ ] Delete selected elements
    - [ ] Position nudging via arrow keys
- [ ] Data import/export
    - [ ] JSON (format TBD)

## Running tests (written in Mocha)

```
# run tests in the CLI
npm test
```

```
# run tests in the CLI with a watcher that will re-run tests
# when you make a code change
npm run test:watch
```

You can also run the test suite in browsers via [Karma](https://karma-runner.github.io).  Only Chrome and Firefox are configured by default because other browsers are a little hard to get to run consistently.  Running the tests in IE are supported and known to work, but are disabled by default.  Please see the note in `karma.conf.js` in the `browsers` section if you would like instructions on how to run the tests in IE.

```
npm run test:browsers
```

## Debugging

```
# run the tests in your browser
npm start
```

From here, you can fire up your browser's dev tools and set breakpoints, step through code, etc.  You can run the app at <a href="http://localhost:9123">http://localhost:9123</a>, or run the tests at <a href="http://localhost:9123/test/">http://localhost:9123/test/</a>.

## A build process

```
npm run build
```

Your compiled code will wind up in the `dist` directory.

## Documentation

You should make sure to update the [JSDoc](http://usejsdoc.org/) annotations as you work.  To view the formatted documentation in your browser:

```
npm run doc
npm run doc:view
```

This will generate the docs and run them in your browser.  If you would like this to update automatically as you work, run this task:

```
npm run doc:live
```

## Versioned releases

```
npm version patch # Or "minor," or "major"
```

This will also use the [gh-pages](https://github.com/tschaub/gh-pages) utility to deploy your versioned project with [GitHub Pages](https://pages.github.com/).

## License

MIT.
