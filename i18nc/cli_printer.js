var _            = require('lodash');
var table        = require('table');
var chalk        = require('chalk');
var EMPTY_SYMBOL = '(empty)';
exports.colors   = new chalk.constructor();

exports.defaultTableOptions =
{
	border: table.getBorderCharacters('void'),
	columnDefault:
	{
		paddingLeft  : 1,
		paddingRight : 1
	},
	drawHorizontalLine: function()
	{
		return 0;
	}
};


exports.printDirtyWords = printDirtyWords;
function printDirtyWords(dirtyWords, paddingLeft)
{
	var mainTableData = dirtyWords.list.map(function(item)
	{
		var ast = item.originalAst;

		return [
			exports.colors.gray(getAstLocStr(ast)),
			exports.colors.yellow(item.code),
			item.reason
		];
	});


	return _printTable(mainTableData,
		{
			paddingLeft: paddingLeft || 1
		});
}


exports.printNewWords = printNewWords;
function printNewWords(newlist, paddingLeft)
{
	var mainTableData = newlist.map(function(item)
	{
		var ast = item.originalAst;

		return [
			exports.colors.gray(getAstLocStr(ast)),
			exports.colors.yellow(item.translateWords.join(','))
		];
	});

	return _printTable(mainTableData,
		{
			paddingLeft: paddingLeft || 1
		});
}

exports.printRefs = printRefs;
function printRefs(info, paddingLeft)
{
	var emptySymbol = exports.colors.gray(EMPTY_SYMBOL);
	var mainTableData =
	[
		[exports.colors.gray('type'), ''+info.type],
		[exports.colors.gray('fileKey'), info.fileKey || emptySymbol],
		[exports.colors.gray('subtype'), info.subtype || emptySymbol],
		[exports.colors.gray('joinIndexs'), info.joinIndexs && info.joinIndexs.join(',') || emptySymbol]
	];

	if (info.subkeys && Object.keys(info.subkeys).length)
	{
		mainTableData.push(['', ' ']);
		mainTableData.push([exports.colors.gray('subkeys'), exports.colors.gray('index')]);
		_.each(info.subkeys, function(val, key)
		{
			mainTableData.push([val, key]);
		});
	}
	else
	{
		mainTableData.push([exports.colors.gray('subkeys'), emptySymbol]);
	}

	return _printTable(mainTableData,
		{
			alignment   : 'right',
			paddingLeft : paddingLeft || 1
		});
}


function _printTable(mainTableData, firstColumnStyle)
{
	var tableOptions = _.extend({}, exports.defaultTableOptions,
		{
			columns:
			{
				0: firstColumnStyle,
			},
		});

	if (table.table)
		return table.table(mainTableData, tableOptions);
	else
		return table.default(mainTableData, tableOptions);
}


exports.getAstLocStr = getAstLocStr;
function getAstLocStr(ast)
{
	if (ast && ast.loc)
		return 'Loc:'+ast.loc.start.line+','+ast.loc.start.column;
	else
		return '';
}
