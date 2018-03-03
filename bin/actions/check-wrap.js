var Promise   = require('bluebird');
var path      = require('path');
var debug     = require('debug')('i18nc:check');
var chalk     = require('chalk');
var cliUtil   = require('../cli_util');
var i18ncUtil = require('../../i18nc/util');

module.exports = function checkWrap(cwd, input, options)
{
	return cliUtil.scanFileList(path.resolve(cwd, input), options.isRecurse)
		.then(function(fileInfo)
		{
			var myOptions =
			{
				I18NHandlerName        : options.I18NHandlerName,
				I18NHandlerAlias       : options.I18NHandlerAlias,
				ignoreScanHandlerNames : options.ignoreScanHandlerNames,
				comboLiteralMode       : options.comboLiteralMode,
				ignoreScanError        : options.ignoreScanError,
				codeModifiedArea       : options.codeModifiedArea,
				cutWordBeautify        : options.cutWordBeautify,
			};
			var files = fileInfo.type == 'list' ? fileInfo.data : [fileInfo.data];
			return Promise.map(files, function(file)
				{
					debug('i18n file start: %s', file);

					return cliUtil.file2i18nc(file)
						.then(function(result)
						{
							var newlist = result.allCodeTranslateWords().list4newWordAsts();
							return {file: file, newlist: newlist};
						});
				},
				{
					concurrency: 5
				})
				.then(function(results)
				{
					results.forEach(function(item)
					{
						if (!item.newlist.length)
						{
							console.log('  '+chalk.green('ok')+' '+item.file);
						}
						else
						{
							console.log('  '+chalk.red('fail')+' '+item.file);
							item.newlist.forEach(function(item)
							{
								var ast = item.originalAst;
								var localStr = 'Loc:'+ast.loc.start.line+','+ast.loc.start.column;
								var wordsStr = item.translateWords.join(',');
								console.log('       '+chalk.gray(localStr)+'    '+wordsStr);
							});
						}
					});
				});
		});
}
