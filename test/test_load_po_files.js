var expect        = require('expect.js');
var i18ncUtil     = require('../i18nc/util');
var autoTestUtils = require('./auto_test_utils');


describe('#load_po_files', function()
{
	describe('#autoLoadPOFiles', function()
	{
		describe('#async', function()
		{
			it('#file', function()
			{
				return i18ncUtil.autoLoadPOFiles(__dirname+'/input/pofiles/en-US.po')
					.then(function(json)
					{
						var otherJson = autoTestUtils.requireAfterWrite('autoLoadPOFiles_en-US.json', json);
						expect(json).to.eql(otherJson);
					});
			});

			it('#dir', function()
			{
				return i18ncUtil.autoLoadPOFiles(__dirname+'/input/pofiles')
					.then(function(json)
					{
						var otherJson = autoTestUtils.requireAfterWrite('autoLoadPOFiles_all.json', json);
						expect(json).to.eql(otherJson);
					});
			});
		});


		describe('#sync', function()
		{
			it('#file', function()
			{
				var json = i18ncUtil.autoLoadPOFilesSync(__dirname+'/input/pofiles/en-US.po')
				var otherJson = autoTestUtils.requireAfterWrite('autoLoadPOFiles_en-US.json', json);
				expect(json).to.eql(otherJson);
			});

			it('#dir', function()
			{
				var json = i18ncUtil.autoLoadPOFilesSync(__dirname+'/input/pofiles')
				var otherJson = autoTestUtils.requireAfterWrite('autoLoadPOFiles_all.json', json);
				expect(json).to.eql(otherJson);
			});
		});
	});

});
