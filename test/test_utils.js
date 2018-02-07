var Promise       = require('bluebird');
var mkdirp        = Promise.promisify(require('mkdirp'));
var expect        = require('expect.js');
var i18nc         = require('../');
var autoTestUtils = require('./auto_test_utils')
var TMP_PATH      = __dirname+'/tmp/';

describe('#utils', function()
{
	before(function()
	{
		return Promise.all(
			[
				mkdirp(TMP_PATH+'mulitResult2POFiles')
			]);
	});

	it('#mulitResult2POFiles', function()
	{
		var mulitI18NCOutput = require('./input/mulit_i18nc_output');
		return i18nc.util.mulitResult2POFiles(mulitI18NCOutput, TMP_PATH+'mulitResult2POFiles',
			{
				pickFileLanguages: ['zh-TW', 'en-US']
			});
	});

	it('#loadPOFiles', function()
	{
		return i18nc.util.loadPOFiles(__dirname+'/input/pofiles')
			.then(function(json)
			{
				var otherJson = autoTestUtils.requireAfterWrite('loadpofiles_output.json', json);
				expect(json).to.eql(otherJson);
			});
	});

	it('#isI18NHandlerAllWrap', function(){});
});
