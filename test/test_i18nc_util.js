var Promise       = require('bluebird');
var mkdirp        = Promise.promisify(require('mkdirp'));
var expect        = require('expect.js');
var i18nc         = require('../');
var autoTestUtils = require('./auto_test_utils');
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
			return i18nc.util.mulitResult2POFiles(mulitI18NCOutput, TMP_PATH+'mulitResult2POFiles',
				{
					pickFileLanguages: ['zh-TW', 'en-US']
				});
		});
	});

	describe('#loadPOFiles', function()
	{
		it('#base', function()
		{
			return i18nc.util.loadPOFiles(__dirname+'/input/pofiles')
				.then(function(json)
				{
					var otherJson = autoTestUtils.requireAfterWrite('loadpofiles_output.json', json);
					expect(json).to.eql(otherJson);
				});
		});
	});

	describe('#isI18NHandlerAllWrap', function()
	{
		var arr1 = {DEFAULTS:['中文1', '中文2']};
		var arr11 = {DEFAULTS:['中文2', '中文1']};
		var arr2 = {DEFAULTS:['中文2']};
		var arr3 = {DEFAULTS:['中文3']};

		it('#base', function()
		{
			expect(i18nc.util.isI18NHandlerAllWrap({})).to.be(true);
			expect(i18nc.util.isI18NHandlerAllWrap(
				{
					codeTranslateWords: arr1
				}))
				.to.be(false);
			expect(i18nc.util.isI18NHandlerAllWrap(
				{
					codeTranslateWords: arr1,
					I18NArgsTranslateWords: arr11
				}))
				.to.be(true);
			expect(i18nc.util.isI18NHandlerAllWrap(
				{
					codeTranslateWords: arr1,
					I18NArgsTranslateWords: arr2
				}))
				.to.be(false);
			expect(i18nc.util.isI18NHandlerAllWrap(
				{
					codeTranslateWords: arr1,
					I18NArgsTranslateWords: arr3
				}))
				.to.be(false);
		});

		it('#subScopeData', function()
		{
			expect(i18nc.util.isI18NHandlerAllWrap({subScopeDatas:[]})).to.be(true);
			expect(i18nc.util.isI18NHandlerAllWrap({subScopeDatas:[{codeTranslateWords:arr1}]})).to.be(false);
			expect(i18nc.util.isI18NHandlerAllWrap(
				{
					subScopeDatas:[
						{
							codeTranslateWords:arr1,
							I18NArgsTranslateWords:arr11
						}]
				}))
				.to.be(true);
			expect(i18nc.util.isI18NHandlerAllWrap(
				{
					subScopeDatas:[
						{
							codeTranslateWords:arr1,
							I18NArgsTranslateWords:arr11
						},
						{
							codeTranslateWords: arr1,
							I18NArgsTranslateWords: arr2
						}]
				}))
				.to.be(false);
		});
	});
});
