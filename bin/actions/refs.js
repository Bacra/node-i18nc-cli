'use strict';

var debug     = require('debug')('i18nc:refs');
var i18ncUtil = require('../../i18nc/util');
var cliPrinter = require('../../i18nc/cli_printer');

module.exports = function(str)
{
	str = str.replace(/^\D*/, '');
	debug('deal str: %s', str);

	var info = i18ncUtil.refs.parse(str);
	var output = cliPrinter.printRefs(info);
	console.log(output);
};
