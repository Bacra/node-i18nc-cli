var _ = require('loadsh');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var glob = Promise.promisify(require('glob'));
var mkdirp = Promise.promisify(require('mkdirp'));
var path = require('path');

exports.sacnFileList = scanFileList;
function scanFileList(input, recurse)
{
	return fs.statAsync(input)
		.then(function(stats)
		{
			if (stats.isFile())
			{
				return fs.realpath(input)
					.then(function(file)
					{
						return {
							type: 'one',
							data: file
						};
					});
			}
			else if (stats.isDirectory())
			{
				if (!recurse) throw new Error('Input Is A Directory');

				return glob('**/*', {cwd: input, nodir: true, realpath: true})
					.then(function(files)
					{
						return {
							type: 'list',
							data: files
						};
					});
			}
			else
			{
				throw new Error('Input Is Not File Or Directory');
			}
		},
		function(err)
		{
			if (!recurse || !err || !err.code == 'ENOENT') throw err;

			return glob(input, {nodir: true, realpath: true})
				.then(function(files)
				{
					return {
						type: 'list',
						data: files
					}
				});
		});
}

/**
 * 写入一个文件，需要判断input本身的文件状态
 */
exports.writeOneFile = writeOneFile;
function writeOneFile(output, content, input)
{
	return fs.statAsync(output)
		.then(function(stats)
		{
			if (stats.isFile())
			{
				return output;
			}
			else if (stats.isDirectory())
			{
				var filename = path.filename(input);
				return output+'/'+filename;
			}
			else
			{
				throw new Error('Input Is Not File Or Directory');
			}
		},
		function(err)
		{
			if (!err || err.code != 'ENOENT') throw err;

			// 当文件不存在的时候
			var tailStr = output[output.length-1];
			var dir, rfile;
			if (tailStr == '/' || tailStr == '\\')
			{
				dir = output;
				rfile = dir + path.filename(input);
			}
			else
			{
				dir = path.resolve(output, '..');
				rfile = output;
			}

			return mkdirp(dir)
				.then(function()
				{
					return rfile;
				});
		})
		.then(function(rfile)
		{
			return fs.writeFileAsync(rfile, content)
				.then(function()
				{
					return rfile;
				});
		});
}
