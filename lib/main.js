var Promise = require('bluebird');
var debug = require('debug')('i18nc');
var fs = Promise.promisifyAll(require('fs'));
var i18nc = require('i18nc-core');
var mkdirp = Promise.promisify(require('mkdirp'));
var glob = Promise.promisify(require('glob'));
var stripBOM = require('strip-bom');
var path = require('path');

exports.run = function(input, cwd, output, dbfile, options)
{
	glob(input, {cwd: cwd})
		.then(function(files)
		{
			return Promise.map(files, function(file)
				{
					return fileHanlder(file, cwd, output, options);
				},
				{
					concurrency: 5
				});
		})
		.then(function(data)
		{});
}


function fileHanlder(file, cwd, output, options)
{
	var rfile = path.resolve(cwd, file);
	debug('readfile: %s', rfile);

	return fs.readFileASync(cwd+'/'+file, {encoding: 'utf8'})
		.then(function(code)
		{
			var code = stripBOM(code);
			var info = i18nc(code, options);
			var wfile = path.resolve(cwd, output, file);
			debug('writefile: %s', wfile);

			return fs.writeFileAsync(wfile, info.code)
				.then(function()
				{
					delete info.code;
					return info;
				});
		});
}
