var Promise		= require('bluebird');
var debug		= require('debug')('i18nc');
var fs			= Promise.promisifyAll(require('fs'));
var i18nc		= require('i18nc-core');
var mkdirp		= Promise.promisify(require('mkdirp'));
var path		= require('path');
var extend		= require('extend');
var i18ncUtil	= require('../../i18nc/util');
var cliUtil		= require('../cli_util');


module.exports = function code(cwd, input, output, options)
{
	var dbfile = options.dbfile;
	var inputPOFile = options['input-po-file'];
	var inputPODir = options['input-po-dir'];
	var readDBFilePromise;

	if (dbfile)
	{
		dbfile = path.resolve(cwd, dbfile);
		debug('read dbfile:%s', dbfile);

		readDBFilePromise = fs.readFileAsync(dbfile,
			{
				encoding: 'utf8'
			})
			.then(function(data)
			{
				return JSON.parse(data);
			});
	}

	var allfiledata = {};

	return Promise.all(
		[
			cliUtil.scanFileList(options.input, null, options.r),
			readDBFilePromise,
			inputPOFile && i18i18ncUtil.loadPOFile(path.resolve(cwd, inputPOFile)),
			inputPODir && i18ncUtil.autoLoadPOFiles(path.resolve(cwd, inputPODir))
		])
		.then(function(data)
		{
			var fileInfo = data[0];
			var dbTranslateWords = extend(true, {}, data[2], data[3], data[1]);
			var myOptions =
			{
				dbTranslateWords  : dbTranslateWords,
				I18NHandlerName   : options['i18n-hanlder-name'],
				pickFileLanguages : options.lans
			};

			if (fileInfo.type == 'list')
			{
				return Promise.map(fileInfo.data, function(file)
					{
						debug('i18n file start: %s', file);

						return i18ncUtil.file2i18nc(file, myOptions)
							.then(function(data)
							{
								var code = data.code;
								delete data.code;
								allfiledata[file] = data;
								if (!options.c) return;

								var wfile = path.resolve(cwd, output, file);
								debug('writefile: %s', wfile);

								return writeFile(wfile, code)
									.then(function()
									{
										console.log('write file: '+wfile);
									});
							});
					},
					{
						concurrency: 5
					});
			}
			else
			{
				var file = fileInfo.data;
				debug('one file mod:%s', file);

				return i18ncUtil.file2i18nc(file, myOptions)
					.then(function(data)
					{
						var code = data.code;
						delete data.code;

						allfiledata[file] = data;
						if (!options.c) return;

						var wfile = path.resolve(cwd, output);
						debug('writefile: %s', wfile);

						return cliUtil.writeOneFile(output, code, file)
							.then(function(realfile)
							{
								console.log('write file: '+realfile);
							});
					});
			}
		})
		.then(function()
		{
			// 如果仅仅检查，则不处理写的逻辑
			if (options.c) return;

			var outputWordFile = options['output-word-file'];
			var writeOutputWordFilePromise;
			if (outputWordFile)
			{
				outputWordFile = path.resolve(cwd, outputWordFile);
				writeOutputWordFilePromise = writeFile(outputWordFile, JSON.stringify(allfiledata, null, '\t'))
					.then(function()
					{
						console.log('write words file: '+outputWordFile);
					});
			}

			var outputPODir = options['output-po-dir'];
			if (outputPODir) outputPODir = path.resolve(cwd, outputPODir);

			return Promise.all(
				[
					writeOutputWordFilePromise,
					outputPODir && i18ncUtil.mulitResult2POFiles(allfiledata, outputPODir,
						{
							pickFileLanguages: options.lans
						})
				])
				.then(function(){});
		});
}


function writeFile(file, content)
{
	return mkdirp(path.dirname(file))
		.then(function()
		{
			return fs.writeFileAsync(file, content);
		});
}
