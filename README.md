# ng2-testable-lib

## Building an **Angular5** library with **@angular/cli** and **ng-packagr**

This project takes the developer through the process of building an environment to create, test and build an **Angular5** library based on the [ng-packaged repository](https://github.com/dherges/ng-packaged.git). 

### Set up an Angular CLI project

Get benefits of **@angular/cli** :

```bash
ng new library-generator
```

### Create the **sample** library

Create the library folder on the top of the angular app.

Create the library module [sample/src/sample.module.ts]()

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [],
  exports: []
})
export class SampleModule { }

```

Create the library entry point [sample/public_api.ts]()

```typescript
export * from './src/sample.module'
```

### Register the library

Open **.angular-cli.json** to add the app that describe the library (after the default app) :

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "project": {
    "name": "ng-2-testable-lib"
  },
  "apps": [
    {
      // default app
    },
    {
      "root": "sample",
      "appRoot": "src",
      "name": "sample",
      "outDir": "dist/sample",
      "assets": [
        "assets"
      ],
      "index": "../src/index.html",
      "main": "../src/main.ts",
      "polyfills": "../src/polyfills.ts",
      "test": "test.ts",
      "tsconfig": "../src/tsconfig.app.json",
      "testTsconfig": "tsconfig.spec.json",
      "prefix": "",
      "styles": [
        "../src/styles.css"
      ],
      "scripts": [],
      "environmentSource": "../src/environments/environment.ts",
      "environments": {
        "dev": "../src/environments/environment.ts",
        "prod": "../src/environments/environment.prod.ts"
      }
    }
  ],
  // ...
}
```

Open **tsconfig.json** to map the library path :

```json
{
  // ...
  "angularCompilerOptions": {
    "paths": {
      "sample": [ "../sample/public_api.ts" ]
    }
  },
  "compilerOptions": {
    // ...
    "paths": {
      "sample": ["../sample/public_api.ts"]
    }
  }
}

```

Relaunch **vscode** to ensure that the new typescript configuration is available. 

Import the **sample.module** in [src/app/app.module.ts](). You should have benefits of **vscode intellisense**.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SampleModule } from "sample";

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SampleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

Copy [src/app/test.ts]() to [sample/test.ts](). 

Copy [src/app/tsconfig.spec.ts]() to [sample/tsconfig.spec.ts](). 

This files will be required for running the **sample library** unit tests.

Ensure that everything is fine :

```bash
ng test
```

### Create the **sample-component**

Use the **--app** parameter to specify the app that use it :

```bash
ng g component sample --app=sample
```

Take a look to the **sample.module** :

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleComponent } from './sample/sample.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SampleComponent],
  providers: [],
  exports: []
})
export class SampleModule { }
```

Awesome, but you have to export manually the **sample.component** in the module :

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleComponent } from './sample/sample.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SampleComponent],
  providers: [],
  exports: [SampleComponent]
})
export class SampleModule { }
```

and in [sample/public_api.ts]() :

```typescript
export * from './src/sample.module'
// All public members of the library must be added here.
export * from './src/sample/sample.component'
```

Add an instance of the **sample-component** in [src/app/app.component.html] :

```html
<div style="text-align:center">
  <h1>
    Welcome to {{ title }}!
  </h1>
  <sample></sample>
</div>
```

Ensure that everything is fine :

```bash
ng serve
```

**sample.component** should be rendered as expected.

### Testing

To execute [src/app/app.component.spec.ts]() with success, the **sample.module** must be imported in the test bed configuration :

```typescript
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SampleModule } from "sample";
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        SampleModule
      ]
    }).compileComponents();
  }));
  // ...
}
```

Run the tests of the app :

```bash
ng test
```

Run the tests of the library :

```bash
ng test --app=sample
```

## Debugging with **Chrome DevTools Overview**

Open the debug page, open the **Chrome DevTools Overview**, open **Sources** tab, served files are in [top/webpack]().

## Debugging with **vscode**

Add a launch chrome task :

```json
{
    "name": "Launch debug",
    "type": "chrome",
    "request": "launch",
    "url": "http://localhost:9876/debug.html",
    "sourceMaps": true,
    "webRoot": "${workspaceRoot}"
}
```

Run `ng test` or `ng test --app=sample`.

Add some break points.

Run **Launch debug**.

## Packaging the library

Install [ng-packagr](https://github.com/dherges/ng-packagr) :

```bash
npm i -D ng-packagr
```

Create the [sample/package.json]() that describe the library and the **ng-packagr** configuration :

```json
{
  "name": "sample",
  "version": "1.0.0-alpha.0",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/raphael-volt/ng2-testable-lib-sample.git"
  },
  "author": "raphael-volt",
  "private": true,
  "peerDependencies": {
    "@angular/core": "^5.0.0",
    "@angular/common": "^5.0.0"
  },
  "ngPackage": {
    "$schema": "../node_modules/ng-packagr/ng-package.schema.json",
    "workingDirectory": "../.ng_build",
    "lib": {
      "entryFile": "public_api.ts"
    },
    "dest": "dist/sample"
  }
}
```

Create the build task in app [package.json]()

```json
{
  // ...
   "scripts": {
    // ...
    "build:sample": "ng-packagr -p sample/package.json"
  },
  // ...
}

```

then run it :

```bash
npm run build:sample
```

Generate the **tgz archive** :

```bash
cd dist/sample
npm pack
```

## Install the library localy

`cd` to an angular app, then :

```bash
npm i <relative-path-to-archive>
``` 

Import module to [app.module]() and in test bed configuration.


## @TODO : publish to `npm`.