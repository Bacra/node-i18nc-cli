var Promise   = require('bluebird');
var path      = require('path');
var debug     = require('debug')('i18nc:check');
var cliUtil   = require('../cli_util');
var i18ncUtil = require('../../i18nc/util');

module.exports = function chekc(cwd, input, options)
{
	return cliUtil.scanFileList(path.resolve(cwd, input), options.isRecurse)
		.then(function(fileInfo)
		{
			var myOptions =
			{
				I18NHandlerName: options.I18NHandlerName
			};
			var files = fileInfo.type == 'list' ? fileInfo.data : [fileInfo.data];
			return Promise.map(files, function(file)
				{
					debug('i18n file start: %s', file);

					return i18ncUtil.file2i18nc(file)
						.then(function(data)
						{
							if (i18ncUtil.isI18NHandlerAllWrap(data, myOptions))
							{
								console.log('ok check: '+file);
							}
							else
							{
								console.log('fail check: '+file);
							}
						});
				},
				{
					concurrency: 5
				});
		});
}
