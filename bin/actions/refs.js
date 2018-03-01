var debug     = require('debug')('i18nc:refs');
var _         = require('lodash');
var table     = require('table');
var chalk     = require('chalk');
var i18ncUtil = require('../../i18nc/util');

var EMPTY_SYMBOL = chalk.gray('(empty)');

var tableOptions =
{
	border: table.getBorderCharacters('void'),
	columnDefault:
	{
		paddingLeft: 1,
		paddingRight: 1
	},
	columns:
	{
		0: {alignment: 'right'}
	},
	drawHorizontalLine: function()
	{
		return 0;
	}
};

module.exports = function(str)
{
	str = str.replace(/^\D*/, '');
	debug('deal str: %s', str);

	var info = i18ncUtil.refs.parse(str);
	var mainTableData =
	[
		[chalk.gray('type'), ''+info.type],
		[chalk.gray('fileKey'), info.fileKey || EMPTY_SYMBOL],
		[chalk.gray('subtype'), info.subtype || EMPTY_SYMBOL],
		[chalk.gray('joinIndexs'), info.joinIndexs && info.joinIndexs.join(',') || EMPTY_SYMBOL]
	];

	if (info.subkeys && Object.keys(info.subkeys).length)
	{
		mainTableData.push([chalk.gray('subkeys \u21E9'), chalk.gray('\u21E9 \u21E9')]);
		_.each(info.subkeys, function(val, key)
		{
			mainTableData.push([key, val]);
		});
	}
	else
	{
		mainTableData.push([chalk.gray('subkeys'), EMPTY_SYMBOL]);
	}

	var output = table.table(mainTableData, tableOptions);
	console.log(output);
};
