'use strict';

const Promise    = require('bluebird');
const path       = require('path');
const debug      = require('debug')('i18nc:check');
const cliUtil    = require('../cli_util');
const cliPrinter = require('../../util/cli_printer');

module.exports = function checkWrap(input, options)
{
	return cliUtil.scanFileList(path.resolve(input), options.isRecurse)
		.then(function(fileInfo)
		{
			let myOptions =
			{
				I18NHandlerName        : options.I18NHandlerName,
				I18NHandlerAlias       : options.I18NHandlerAlias,
				ignoreScanHandlerNames : options.ignoreScanHandlerNames,
				codeModifyItems        : options.codeModifyItems,
				I18NHandler:
				{
					data: {onlyTheseLanguages: options.onlyTheseLanguages},
					style: {minFuncCode: options.minTranslateFuncCode},
					insert:
					{
						checkClosure: options.isCheckClosureForNewI18NHandler,
					},
				}
			};

			let files = fileInfo.type == 'list' ? fileInfo.data : [fileInfo.data];
			return Promise.map(files, function(file)
				{
					debug('i18n file start: %s', file);

					return cliUtil.file2i18nc(file, myOptions)
						.then(function(result)
						{
							let newlist = result.allCodeTranslateWords().list4newWordAsts();
							let dirtyWords = result.allDirtyWords();
							return {file: file, newlist: newlist, dirtyWords: dirtyWords};
						});
				},
				{
					concurrency: 5
				})
				.then(function(results)
				{
					results.forEach(_printResult);
				});
		});
}


function _printResult(item)
{
	if (!item.newlist.length && !item.dirtyWords.list.length)
	{
		console.log('  '+cliPrinter.colors.green('ok')+' '+item.file);
	}
	else
	{
		console.log('  '+cliPrinter.colors.red('fail')+' '+item.file);
		let output = cliPrinter.printDirtyAndNewWords(item.dirtyWords, item.newlist, 7);

		console.log(output);
	}
}
