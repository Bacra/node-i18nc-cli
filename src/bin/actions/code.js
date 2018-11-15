'use strict';

const Promise   = require('bluebird');
const debug     = require('debug')('i18nc');
const fs        = Promise.promisifyAll(require('fs'));
const mkdirp    = Promise.promisify(require('mkdirp'));
const path      = require('path');
const extend    = require('extend');
const cliUtil   = require('../cli_util');
const i18ncUtil = require('../../util/index');


module.exports = async function code(input, output, options)
{
	let translateDBFile = options.translateDBFile;
	let readTranslateDBFilePromise;

	if (translateDBFile)
	{
		translateDBFile = path.resolve(translateDBFile);
		debug('read translateDBFile:%s', translateDBFile);

		readTranslateDBFilePromise = fs.readFileAsync(translateDBFile,
			{
				encoding: 'utf8'
			})
			.then(function(data)
			{
				return JSON.parse(data);
			});
	}

	let allfiledata = {};
	let data = await Promise.all(
		[
			cliUtil.scanFileList(path.resolve(input), null, options.isRecurse),
			readTranslateDBFilePromise,
			options.inputPOFile && i18ncUtil.loadPOFile(path.resolve(options.inputPOFile)),
			options.inputPODir && i18ncUtil.autoLoadPOFiles(path.resolve(options.inputPODir))
		]);
	let fileInfo = data[0];
	let dbTranslateWords = extend(true, {}, data[2], data[3], data[1]);
	let taskOptions =
	{
		dbTranslateWords       : dbTranslateWords,
		I18NHandlerName        : options.I18NHandlerName,
		I18NHandlerAlias       : options.I18NHandlerAlias,
		ignoreScanHandlerNames : options.ignoreScanHandlerNames,
	};

	if (fileInfo.type == 'list')
	{
		await Promise.map(fileInfo.data.list, async function(fileItem)
			{
				let file = fileItem.file;
				let fileOptions = fileItem.extend(taskOptions);
				debug('i18n file start: %s', file);

				let data = await cliUtil.file2i18nc(file, fileOptions)
				let code = data.code;
				delete data.code;
				allfiledata[file] = data;
				if (options.isOnlyCheck) return;

				let wfile = path.resolve(output, file);
				debug('writefile: %s', wfile);

				await writeFile(wfile, code)
				console.log('write file: '+wfile);
			},
			{
				concurrency: 5
			});
	}
	else
	{
		let fileItem = fileInfo.data;
		let file = fileItem.file;
		let fileOptions = fileInfo.extend(fileOptions);
		debug('one file mod:%s', file);

		let data = await cliUtil.file2i18nc(file, taskOptions);
		let code = data.code;
		delete data.code;

		allfiledata[file] = data;
		if (options.isOnlyCheck) return;

		let wfile = path.resolve(output);
		debug('writefile: %s', wfile);

		wfile = await cliUtil.getWriteOneFilePath(wfile, file);
		await fs.writeFileAsync(wfile, code);
		console.log('write file: '+wfile);
	}
	// 如果仅仅检查，则不处理写的逻辑
	if (options.isOnlyCheck) return;

	let outputWordFile = options.outputWordFile;
	let writeOutputWordFilePromise;
	if (outputWordFile)
	{
		outputWordFile = path.resolve(outputWordFile);
		writeOutputWordFilePromise = writeFile(outputWordFile, JSON.stringify(allfiledata, null, '\t'))
			.then(function()
			{
				console.log('write words file: '+outputWordFile);
			});
	}

	let outputPODir = options.outputPODir;
	if (outputPODir) outputPODir = path.resolve(outputPODir);

	return Promise.all(
		[
			writeOutputWordFilePromise,
			outputPODir && i18ncUtil.mulitResult2POFiles(allfiledata, outputPODir,
				{
					pickFileLanguages: options.pickFileLanguages
				})
		]);
}


async function writeFile(file, content)
{
	await mkdirp(path.dirname(file));
	return fs.writeFileAsync(file, content);
}
