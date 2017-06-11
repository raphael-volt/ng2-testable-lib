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

Add the following rules into the generated `.gitignore` file:
```txt
# Karma transform
init-test-bed.spec.js
src/**/*.js

# coverage
coverage
```
Delete the generated `README.MD` file.