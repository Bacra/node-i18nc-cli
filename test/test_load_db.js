'use strict';

const expect        = require('expect.js');
const loader        = require('../src/util/load_db');
const autoTestUtils = require('./auto_test_utils');
const requireAfterWrite = autoTestUtils.requireAfterWrite('load_db');
const INPUT_PATH = __dirname+'/input/';


describe('#load_db', function()
{
	describe('#autoLoadDB', function()
	{
		describe('#async', function()
		{
			it('#file', function()
			{
				return loader.autoLoadDB(INPUT_PATH+'pofiles/en-US.po')
					.then(function(json)
					{
						let otherJson = requireAfterWrite('autoLoadDB_en-US.json', json);
						expect(json).to.eql(otherJson);
					});
			});

			it('#dir', function()
			{
				return loader.autoLoadDB(INPUT_PATH+'pofiles')
					.then(function(json)
					{
						let otherJson = requireAfterWrite('autoLoadDB_all.json', json);
						expect(json).to.eql(otherJson);
					});
			});
		});


		describe('#sync', function()
		{
			it('#file', function()
			{
				let json = loader.autoLoadDBSync(INPUT_PATH+'pofiles/en-US.po')
				let otherJson = requireAfterWrite('autoLoadDB_en-US.json', json);
				expect(json).to.eql(otherJson);
			});

			it('#dir', function()
			{
				let json = loader.autoLoadDBSync(INPUT_PATH+'pofiles')
				let otherJson = requireAfterWrite('autoLoadDB_all.json', json);
				expect(json).to.eql(otherJson);
			});
		});
	});

});
