'use strict';

const expect        = require('expect.js');
const loader        = require('../util/load_po_files');
const autoTestUtils = require('./auto_test_utils');
const INPUT_PATH = __dirname+'/../../test/input/';


describe('#load_po_files', function()
{
	describe('#autoLoadPOFiles', function()
	{
		describe('#async', function()
		{
			it('#file', function()
			{
				return loader.autoLoadPOFiles(INPUT_PATH+'pofiles/en-US.po')
					.then(function(json)
					{
						let otherJson = autoTestUtils.requireAfterWrite('autoLoadPOFiles_en-US.json', json);
						expect(json).to.eql(otherJson);
					});
			});

			it('#dir', function()
			{
				return loader.autoLoadPOFiles(INPUT_PATH+'pofiles')
					.then(function(json)
					{
						let otherJson = autoTestUtils.requireAfterWrite('autoLoadPOFiles_all.json', json);
						expect(json).to.eql(otherJson);
					});
			});
		});


		describe('#sync', function()
		{
			it('#file', function()
			{
				let json = loader.autoLoadPOFilesSync(INPUT_PATH+'pofiles/en-US.po')
				let otherJson = autoTestUtils.requireAfterWrite('autoLoadPOFiles_en-US.json', json);
				expect(json).to.eql(otherJson);
			});

			it('#dir', function()
			{
				let json = loader.autoLoadPOFilesSync(INPUT_PATH+'pofiles')
				let otherJson = autoTestUtils.requireAfterWrite('autoLoadPOFiles_all.json', json);
				expect(json).to.eql(otherJson);
			});
		});
	});

});
