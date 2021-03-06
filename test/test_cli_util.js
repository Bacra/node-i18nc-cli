'use strict';

const _				= require('lodash');
const Promise       = require('bluebird');
const fs            = Promise.promisifyAll(require('fs'));
const mkdirp        = Promise.promisify(require('mkdirp'));
const rimraf        = Promise.promisify(require('rimraf'));
const path          = require('path');
const expect        = require('expect.js');
const cliUtil       = require('../src/bin/cli_util');
const autoTestUtils = require('./auto_test_utils');

const requireAfterWrite = autoTestUtils.requireAfterWrite('cli_util');
const INPUT_PATH    = __dirname+'/input/';
const TMP_PATH      = __dirname+'/tmp/';


describe('#cli_util', function()
{
	describe('#scanFileList', function()
	{
		let inputDir = fs.realpathSync(INPUT_PATH+'scan_dir/')+'/';

		describe('#no_recurse', function()
		{
			it('#file', function()
			{
				return cliUtil.scanFileList(inputDir+'root.file')
					.then(function(data)
					{
						expect(data.type).to.be('one');
						expect(data.data.toJSON()).to.be(path.normalize(inputDir+'root.file'));
					});
			});

			it('#not_exists', function()
			{
				return cliUtil.scanFileList(inputDir+'not_exists')
					.then(function()
					{
						expect().fail();
					},
					function(err)
					{
						expect(err.code).to.be('ENOENT');
					});
			});

			it('#dir', function()
			{
				return cliUtil.scanFileList(inputDir)
					.then(function()
					{
						expect().fail();
					},
					function(err)
					{
						expect(err.message).to.be('Input Is A Directory');
					});
			});

			it('#dir *.file', function()
			{
				return cliUtil.scanFileList(inputDir+'*.file')
					.then(function(data)
					{
						expect(data.type).to.be('list');
						expect(data.data.toJSON()).to.eql([path.normalize(inputDir+'root.file')]);
					});
			});
		});

		describe('#recurse', function()
		{
			it('#file', function()
			{
				return cliUtil.scanFileList(inputDir+'root.file', true)
					.then(function(data)
					{
						expect(data.type).to.be('one');
						expect(data.data.toJSON()).to.be(path.normalize(inputDir+'root.file'));
					});
			});

			it('#not_exists', function()
			{
				return cliUtil.scanFileList(inputDir+'not_exists', true)
					.then(function(data)
					{
						expect(data.type).to.be('list');
						expect(data.data.toJSON()).to.eql([]);
					});
			});

			it('#dir', function()
			{
				return cliUtil.scanFileList(inputDir, true)
					.then(function(data)
					{
						expect(data.type).to.be('list');
						expect(data.data.toJSON().sort()).to.eql(
							[
								path.normalize(inputDir+'root.file'),
								path.normalize(inputDir+'child_dir/child1.file'),
								path.normalize(inputDir+'child_dir/child2.file')
							].sort());
					});
			});

			it('#dir *.file', function()
			{
				return cliUtil.scanFileList(inputDir+'*.file', true)
					.then(function(data)
					{
						expect(data.type).to.be('list');
						expect(data.data.toJSON()).to.eql([path.normalize(inputDir+'root.file')]);
					});
			});
		});
	});


	describe('#getWriteOneFilePath', function()
	{
		let outputDir = TMP_PATH+'getWriteOneFilePath/';
		let inputFile = INPUT_PATH+'input.file';

		before(function()
		{
			return mkdirp(outputDir)
				.then(function()
				{
					return rimraf(outputDir);
				})
				.then(function()
				{
					return mkdirp(outputDir);
				})
				.then(function()
				{
					return fs.writeFileAsync(outputDir+'prev.file', '');
				});
		});

		it('#file', function()
		{
			return cliUtil.getWriteOneFilePath(outputDir+'prev.file', inputFile)
				.then(function(rfile)
				{
					expect(path.normalize(rfile)).to.be(path.normalize(outputDir+'prev.file'));
				});
		});

		it('#dir', function()
		{
			return cliUtil.getWriteOneFilePath(outputDir, inputFile)
				.then(function(rfile)
				{
					expect(path.normalize(rfile)).to.be(path.normalize(outputDir+'input.file'));
				});
		});

		it('#not exists file', function()
		{
			return cliUtil.getWriteOneFilePath(outputDir+'not_exists.file', inputFile)
				.then(function(rfile)
				{
					expect(path.normalize(rfile)).to.be(path.normalize(outputDir+'not_exists.file'));
				});
		});

		it('#not exists path', function()
		{
			return cliUtil.getWriteOneFilePath(outputDir+'not_exists.dir/', inputFile)
				.then(function(rfile)
				{
					expect(path.normalize(rfile)).to.be(path.normalize(outputDir+'not_exists.dir/input.file'));
				});
		});
	});


	describe('#file2i18nc', function()
	{
		it('#base', function()
		{
			return cliUtil.file2i18nc(INPUT_PATH+'example.js')
				.then(function(data)
				{
					let json = data.toJSON();
					clearCodeResult(json);
					let otherJson = requireAfterWrite('file2i18nc.json', json);
					expect(json).to.eql(otherJson);
				});
		});
	});

});


function clearCodeResult(json)
{
	delete json.code;
	_.each(json.subScopeDatas, clearCodeResult);
}
