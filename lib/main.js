var Promise		= require('bluebird');
var debug		= require('debug')('i18nc');
var fs			= Promise.promisifyAll(require('fs'));
var i18nc		= require('i18nc-core');
var mkdirp		= Promise.promisify(require('mkdirp'));
var glob		= Promise.promisify(require('glob'));
var stripBOM	= require('strip-bom');
var path		= require('path');
var extend		= require('extend');


exports.code = function code(cwd, input, output, options)
{
	var dbfile = options.dbfile;
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
			readDBFilePromise
		])
		.then(function(data)
		{
			var files = data[0];
			var dbTranslateWords = data[1];

			return Promise.map(files, function(file)
				{
					debug('i18n file start: %s', file);

					var myOptions = extend(
						{
							dbTranslateWords	: dbTranslateWords,
							defaultFilekey		: file
						},
						options);

					return fileHanlder(cwd, file, output, myOptions)
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
			var optionsWordsFile = options['output-words'];
			if (!optionsWordsFile) return mainData;

			var wfile = path.resolve(cwd, optionsWordsFile);
			return writeFile(wfile, JSON.stringify(mainData, null, '\t'))
				.then(function()
				{
					console.log('write words file: '+optionsWordsFile);

					return mainData;
				});
		});
}


function fileHanlder(cwd, file, output, options)
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
					var wfile = path.resolve(cwd, output, file);
					debug('writefile: %s', wfile);

					return writeFile(wfile, info.code)
						.then(function()
						{
							console.log('write file: '+file);
							return info;
						});
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

