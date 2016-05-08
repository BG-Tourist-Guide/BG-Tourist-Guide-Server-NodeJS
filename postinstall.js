'use strict';
let shelljs = require('shelljs');

shelljs.exec('cd public/web && npm install');
console.log('Postinstall script completed successfully.');