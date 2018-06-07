'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var fs = Promise.promisifyAll(require('fs'));
var expect = require('expect.js');


exports.requireAfterWrite = function requireAfterWrite(filename, data, options)
{
	var file = __dirname+'/output/'+filename;
	if (!process.env.TEST_BUILD) return _requireOrFs(file, options);

	if (typeof data == 'object')
	{
		data = JSON.stringify(data, null, '\t');
	}

	fs.writeFileSync(file, data);

	return _requireOrFs(file, options);
}

function _requireOrFs(file, options)
{
	options || (options = {});

	switch(options.readMode)
	{
		case 'string':
			return fs.readFileSync(file, {encoding: 'utf8'});

		default:
			return require(file);
	}
}


exports.code2arr = function code2arr(code)
{
	return code.split('\n')
		.filter(function(val)
		{
			return val.trim();
		});
}

exports.diffFiles = function diffFiles(input, output)
{
	return function(filename)
	{
		return Promise.all(
			[
				fs.readFileAsync(input+'/'+filename, {encoding: 'utf8'}),
				fs.readFileAsync(output+'/'+filename, {encoding: 'utf8'})
			])
			.then(function(arr)
			{
				expect(exports.code2arr(arr[1])).to.eql(exports.code2arr(arr[0]));
			});
	}
}
