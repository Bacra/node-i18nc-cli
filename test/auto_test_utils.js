'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const expect = require('expect.js');
const testReq = require('i18nc-test-req');
testReq.ROOT_PATH = __dirname+'/output/';


exports.requireAfterWrite = testReq;
exports.code2arr = testReq.code2arr;

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
