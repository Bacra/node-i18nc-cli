var Promise		= require('bluebird');
var debug		= require('debug')('i18nc');
var fs			= Promise.promisifyAll(require('fs'));
var i18nc		= require('i18nc-core');
var mkdirp		= Promise.promisify(require('mkdirp'));
var glob		= Promise.promisify(require('glob'));
var stripBOM	= require('strip-bom');
var path		= require('path');
var extend		= require('extend');
var utils		= require('../utils');


module.exports = function code(cwd, input, output, options)
{
	var dbfile = options.dbfile;
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

	return Promise.all(
		[
			glob(input, {cwd: cwd}),
			readDBFilePromise,
			inputPODir && utils.loadPOFiles(path.resolve(cwd, inputPODir))
		])
		.then(function(data)
		{
			var files = data[0];
			var dbTranslateWords = extend(true, {}, data[1], data[2]);

			return Promise.map(files, function(file)
				{
					debug('i18n file start: %s', file);

					var myOptions = extend(
						{
							dbTranslateWords  : dbTranslateWords,
							I18NHandlerName   : options['i18n-hanlder-name'],
							pickFileLanguages : options.lans
						});

					return fileI18NHanlder(cwd, file, options.c ? null : output, myOptions)
						.then(function(data)
						{
							if (!data) return;

							delete data.code;
							data.file = file;

							return data;
						});
				},
				{
					concurrency: 5
				});
		})
		.then(function(data)
		{
			var map = {};
			data.forEach(function(item)
			{
				if (item)
				{
					map[item.file] = item;
				}
			});

			return map;
		})
		.then(function(mainData)
		{
			// 如果仅仅检查，则不处理写的逻辑
			if (options.c) return mainData;

			var outputWordFile = options['output-word-file'];
			var writeOutputWordFilePromise;
			if (outputWordFile)
			{
				outputWordFile = path.resolve(cwd, outputWordFile);
				writeOutputWordFilePromise = writeFile(outputWordFile, JSON.stringify(mainData, null, '\t'))
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
					outputPODir && utils.mulitResult2POFiles(mainData, outputPODir,
						{
							pickFileLanguages: options.lans
						})
				])
				.then(function()
				{
					return mainData;
				});
		});
}


function fileI18NHanlder(cwd, file, output, options)
{
	var rfile = path.resolve(cwd, file);
	debug('readfile: %s', rfile);

	return fs.statAsync(rfile)
		.then(function(stat)
		{
			if (!stat.isFile())
			{
				debug('is not file:%s', rfile);
				return;
			}

			return fs.readFileAsync(rfile,
				{
					encoding: 'utf8'
				})
				.then(function(code)
				{
					var code = stripBOM(code);
					var info = i18nc(code, options);

					if (output)
					{
						var wfile = path.resolve(cwd, output, file);
						debug('writefile: %s', wfile);

						return writeFile(wfile, info.code)
							.then(function()
							{
								console.log('write file: '+file);
								return info;
							});
					}
				});
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
