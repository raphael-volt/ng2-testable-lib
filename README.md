# ng2-testable-lib

Tutorial on building a testable **Angular2** library.

See [ng2-lib-cli-tools](https://github.com/raphael-volt/ng2-lib-cli-tools) to automatically generate or update a library.

This project takes the developer through the process of building a library for Angular2. The library will be generated with the [generator-angular2-library](https://github.com/jvandemo/generator-angular2-library) which currently does not provide a test environment. 

It will be explained how to configure the project to run tests with **Karma** and **Jasmine**.

# Generate the ng2-testable-library

Yeoman and generator-angular2-library are required, install them if they are not :
```bash
npm install -g yo
npm install -g generator-angular2-library
```
Generate the library :
```bash
yo angular2-library
```
Then set the configuration options according to your context and your git profile. 

All files required to compile our library have been installed.

Add the following rules into the generated [.gitignore](.gitignore) file:
```txt
# Karma transform
init-test-bed.spec.js
src/**/*.js

# coverage
coverage
```
Delete the generated [README.MD](README.MD) file.

# Configuring `Karma`

Install the required dependencies to enable **typescript** to **js** transformation :

```bash
npm install --save-dev karma-typescript karma-typescript-angular2-transform
```
Create the [init-test-bed.spec.ts](init-test-bed.spec.ts) which will import the required plugins:
```typescript
import 'reflect-metadata'
import 'zone.js/dist/zone.js'
import 'zone.js/dist/proxy.js'
import 'zone.js/dist/sync-test.js'
import 'zone.js/dist/jasmine-patch.js'
import 'zone.js/dist/async-test.js'
import 'zone.js/dist/fake-async-test.js'
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
Edit [karma.config.js](karma.config.js) to add more options :
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

# Configuring `typescript`

Edit the [tsconfig.json](tsconfig.json) file to add the required types and **es6** interpretor.
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "rootDir": "./src",
    "target": "es5",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es6",
      "dom"
    ],
    "skipLibCheck": true,
    "types": [
      "jasmine",
      "node"
    ]
  }
}
```
# Basic sample test

Create the [sample.spec.ts](sample.spec.ts) in the **src** directory :
```typescript
import { TestBed, inject, async } from '@angular/core/testing';
import { SampleModule, SampleService } from "./";
describe('SampleTest', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: SampleService,
                    deps: [],
                    useFactory: () => {
                        return new SampleService()
                    }
                }
            ],
            imports: [
                SampleModule
            ]
        })
    })

    it('should expect', () => {
        expect(true).toBeTruthy()
    })

    it('should expect async', async(() => {
        setTimeout(() => {
            expect(true).toBeTruthy()
        }, 500)
    }))
    
    it('should expect fakeAsync', fakeAsync(() => {
        tick()
        expect(true).toBeTruthy()
    }))

    it('should inject', inject([SampleService], (service: SampleService) => {
        expect(service).toBeTruthy()
    }))
})
```
Start `Karma` :
```bash
npm test
```
The test should pass successfully :
```bash
Chrome 59.0.3071 (Linux 0.0.0): Executed 3 of 3 SUCCESS (0.568 secs / 0.56 secs)
```

# Debugging with vscode

Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) if not.

Create a new launch configuration.

Add this configuration to [.vscode/lauch.json](.vscode/lauch.json):
```json
        {
            "name": "Debug tests in Chrome",
            "type": "chrome",
            "request": "attach",
            "port": 9222,
            "sourceMaps": true,
            "webRoot": "${workspaceRoot}"
        }
```
Set customLaunchers and browserNoActivityTimeout into [karma.conf.js](karma.conf.js) :
```js
    customLaunchers: {
      Chrome_with_debugging: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9222'],
        debug: true
      }
    },
    browserNoActivityTimeout: 100000,
```
Add the command test:debug to [package.json](package.json)
```json
"scripts": {
    ...
    "test:debug": "tsc && karma start karma.conf.js --browsers Chrome_with_debugging"
  }
```
Run tests :
```bash
npm run test:debug
```
Click the debug button in debug tab to connect vscode debugger.

Add some breakpoints to your code. Then click restart button (ctrl+shift+F5) in the debugger tool bar.
