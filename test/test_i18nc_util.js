var Promise       = require('bluebird');
var mkdirp        = Promise.promisify(require('mkdirp'));
var expect        = require('expect.js');
var i18ncUtil     = require('../i18nc/util');
var TMP_PATH      = __dirname+'/tmp/';

describe('#i18nc_util', function()
{
	describe('#mulitResult2POFiles', function()
	{
		before(function()
		{
			return mkdirp(TMP_PATH+'mulitResult2POFiles');
		});

		it('#base', function()
		{
			var mulitI18NCOutput = require('./input/mulit_i18nc_output');
			return i18ncUtil.mulitResult2POFiles(mulitI18NCOutput, TMP_PATH+'mulitResult2POFiles',
				{
					pickFileLanguages: ['zh-TW', 'en-US']
				});
		});
	});

});
