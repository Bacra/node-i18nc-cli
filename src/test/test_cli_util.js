'use strict';

const Promise       = require('bluebird');
const fs            = Promise.promisifyAll(require('fs'));
const mkdirp        = Promise.promisify(require('mkdirp'));
const rimraf        = Promise.promisify(require('rimraf'));
const path          = require('path');
const expect        = require('expect.js');
const cliUtil       = require('../bin/cli_util');
const autoTestUtils = require('./auto_test_utils');
const INPUT_PATH = __dirname+'/../../test/input/';
const TMP_PATH = __dirname+'/../../test/tmp/';


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
						expect(data).to.eql(
							{
								type: 'one',
								data: path.normalize(inputDir+'root.file')
							});
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
						expect(data).to.eql(
						{
							type: 'list',
							data: [path.normalize(inputDir+'root.file')]
						});
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
						expect(data).to.eql(
							{
								type: 'one',
								data: path.normalize(inputDir+'root.file')
							});
					});
			});

			it('#not_exists', function()
			{
				return cliUtil.scanFileList(inputDir+'not_exists', true)
					.then(function(data)
					{
						expect(data).to.eql({type: 'list', data: []});
					});
			});

			it('#dir', function()
			{
				return cliUtil.scanFileList(inputDir, true)
					.then(function(data)
					{
						data.data = data.data.sort();
						expect(data).to.eql(
							{
								type: 'list',
								data:
								[
									path.normalize(inputDir+'root.file'),
									path.normalize(inputDir+'child_dir/child1.file'),
									path.normalize(inputDir+'child_dir/child2.file')
								].sort()
							});
					});
			});

			it('#dir *.file', function()
			{
				return cliUtil.scanFileList(inputDir+'*.file', true)
					.then(function(data)
					{
						expect(data).to.eql(
						{
							type: 'list',
							data: [path.normalize(inputDir+'root.file')]
						});
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
					delete json.code;
					let otherJson = autoTestUtils.requireAfterWrite('file2i18nc.json', json);
					expect(json).to.eql(otherJson);
				});
		});
	});

});
