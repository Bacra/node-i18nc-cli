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
						.then(function(data)
						{
							if (i18ncUtil.isAllI18NHandlerWrap(data, myOptions))
								console.log('  '+chalk.green('ok')+' '+file);
							else
								console.log('  '+chalk.red('fail')+' '+file);
						});
				},
				{
					concurrency: 5
				});
		});
}
