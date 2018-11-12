'use strict';

let version = process.version;
if (version && +version.split('.')[0].substr(1) > 8)
	module.exports = require('./src/index');
else
	module.exports = require('./dist/index');
