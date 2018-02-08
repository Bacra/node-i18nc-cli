var path = require('path');
var cliUtil = require('../cli_util');
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
			return Promise.map(list, function(file)
				{
					debug('i18n file start: %s', file);

					return i18ncUtil.file2i18nc(file)
						.then(function(data)
						{
							if (i18ncUtil.isI18NHandlerAllWrap(data, myOptions))
							{
								console.log('ok check: %s', file);
							}
							else
							{
								console.log('fail check: %s', file);
							}
						});
				},
				{
					concurrency: 5
				});
		});
}
