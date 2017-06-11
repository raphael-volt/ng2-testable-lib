# Configuring `Karma`

Install the required dependencies to enable `typescript` to `js` transformation :

```bash
npm install --save-dev karma-typescript karma-typescript-angular2-transform
```
Create the `init-test-bed.spec.ts` which will import the required plugins:
```typescript
import 'reflect-metadata'
import 'zone.js/dist/zone.js'
import 'zone.js/dist/proxy.js'
import 'zone.js/dist/sync-test.js'
import 'zone.js/dist/jasmine-patch.js'
import 'zone.js/dist/async-test.js'
import { TestBed } from '@angular/core/testing'
import { 
  BrowserDynamicTestingModule, 
  platformBrowserDynamicTesting 
} from '@angular/platform-browser-dynamic/testing'

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule, 
  platformBrowserDynamicTesting()
)
```
Init `Karma` :
```bash
karma init
```
Set configuration options as below:
```txt
Which testing framework do you want to use ?
Press tab to list possible options. Enter to move to the next question.
> jasmine

Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
> no

Do you want to capture any browsers automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
> Chrome
>

What is the location of your source and test files ?
You can use glob patterns, eg. 'js/*.js' or 'test/**/*Spec.js'.
Enter empty string to move to the next question.
> init-test-bed.spec.ts
> src/**/*.ts
>

Should any of the files included by the previous patterns be excluded ?
You can use glob patterns, eg. '**/*.swp'.
Enter empty string to move to the next question.
>

Do you want Karma to watch all the files and run the tests on change ?
Press tab to list possible options.
> yes
```
Edit karma.config.js to add more options :
```js
module.exports = function(config) {
  config.set({
    // ...
    frameworks: ['jasmine', 'karma-typescript'],
    // ...
    preprocessors: {
        '**/*.ts': ['karma-typescript']
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        transforms: [
          require('karma-typescript-angular2-transform')
        ]
      },
      compilerOptions: {
        lib: ['ES2015', 'DOM']
      }
    },
    reporters: ['progress', 'karma-typescript'],
  })
})
```