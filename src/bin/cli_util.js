'use strict';

const debug     = require('debug')('i18nc:cli_util');
const Promise   = require('bluebird');
const fs        = Promise.promisifyAll(require('fs'));
const mkdirp    = Promise.promisify(require('mkdirp'));
const path      = require('path');
const i18nc     = require('i18nc-core');
const i18ncUtil = require('../util');
const stripBOM  = require('strip-bom');

exports.scanFileList = scanFileList;
async function scanFileList(input, recurse)
{
	let stats;
	try {
		stats = await fs.statAsync(input);
	}
	catch(err)
	{
		if (!err || !err.code == 'ENOENT') throw err;
		if (!recurse && input.indexOf('*') == -1) throw err;

		debug('input is not exists, start glob');

		let files = await i18ncUtil.cli.scan.dir(input);
		return {
			type: 'list',
			data: files
		};
	}


	if (stats.isFile())
	{
		debug('input is file');
		let file = await i18ncUtil.cli.scan.file(input);
		return {
			type: 'one',
			data: file
		};
	}
	else if (stats.isDirectory())
	{
		debug('input is dir');
		if (!recurse) throw new Error('Input Is A Directory');

		let files = await i18ncUtil.cli.scan.dir(input+'/**/*');
		return {
			type: 'list',
			data: files
		};
	}
	else
	{
		throw new Error('Input Is Not File Or Directory');
	}
}

/**
 * 写入一个文件，需要判断input本身的文件状态
 */
exports.getWriteOneFilePath = getWriteOneFilePath;
async function getWriteOneFilePath(output, input)
{
	let stats;
	try {
		stats = await fs.statAsync(output);
	}
	catch(err)
	{
		if (!err || err.code != 'ENOENT') throw err;

		debug('output is not exists');
		// 当文件不存在的时候
		let tailStr = output[output.length-1];
		let dir, rfile;
		if (tailStr == '/' || tailStr == '\\')
		{
			debug('ouput maybe is path');
			dir = output;
			rfile = dir + path.basename(input);
		}
		else
		{
			dir = path.join(output, '..');
			rfile = output;
		}

		await mkdirp(dir);
		return rfile;
	}

	if (stats.isFile())
	{
		debug('output is file');
		return output;
	}
	else if (stats.isDirectory())
	{
		debug('output is dir');
		return output+'/'+path.basename(input);
	}
	else
	{
		throw new Error('Input Is Not File Or Directory');
	}
}


exports.file2i18nc = file2i18nc;
async function file2i18nc(file, options)
{
	let code = await fs.readFileAsync(file,
		{
			encoding: 'utf8'
		});

	return i18nc(stripBOM(code), options);
}
