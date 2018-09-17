'use strict';

const commonConfig = require('karma-config-brcjs');

module.exports = function(config)
{
	commonConfig(config, require('./package.json'));

	config.set(
	{
		basePath: 'dist/test/',
		files: ['browser/test_*.js'],
		preprocessors: {'browser/test_*.js': ['browserify']},
	});
};
