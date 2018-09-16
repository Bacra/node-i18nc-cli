'use strict';

const Promise   = require('bluebird');
const fs        = Promise.promisifyAll(require('fs'));
const glob      = require('glob');
const debug     = require('debug')('i18nc:load_po_files');
const i18ncPO   = require('i18nc-po');
const stripBOM  = require('strip-bom');
const extend    = require('extend');
const globAsync = Promise.promisify(glob);

exports.autoLoadPOFiles = autoLoadPOFiles;
exports.loadPOFiles = loadPOFiles;
exports.loadPOFile = loadPOFile;

exports.autoLoadPOFilesSync = autoLoadPOFilesSync;
exports.loadPOFilesSync = loadPOFilesSync;
exports.loadPOFileSync = loadPOFileSync;

async function autoLoadPOFiles(input)
{
	let stats = await fs.statAsync(input);

	if (stats.isFile())
		return loadPOFile(input);
	else if (stats.isDirectory())
		return loadPOFiles(input);
	else
		throw new Error('Input Is Not File Or Directory');
}

/**
 * 从po文件中读取dbTranslateWords结构体
 */
async function loadPOFiles(inputDir)
{
	debug('sacn dir:%s', inputDir);

	let files = await globAsync('**/*.po', {cwd: inputDir, nodir: true, absolute: true})
	let arr = await Promise.map(files, function(file)
		{
			debug('load po file:%s', file);
			return loadPOFile(file);
		},
		{
			concurrency: 5
		});

	arr.unshift(true);
	return extend.apply(null, arr);
}

async function loadPOFile(file)
{
	let content = await fs.readFileAsync(file, {encoding: 'utf8'});

	content = stripBOM(content);
	return i18ncPO.parse(content);
}



function autoLoadPOFilesSync(input)
{
	let stats = fs.statSync(input);

	if (stats.isFile())
		return loadPOFileSync(input);
	else if (stats.isDirectory())
		return loadPOFilesSync(input);
	else
		throw new Error('Input Is Not File Or Directory');
}

/**
 * 从po文件中读取dbTranslateWords结构体
 */
function loadPOFilesSync(inputDir)
{
	debug('sacn dir:%s', inputDir);
	let files = glob.sync('**/*.po', {cwd: inputDir, nodir: true, absolute: true});
	let arr = files.map(loadPOFileSync);
	arr.unshift(true);
	return extend.apply(null, arr);
}

function loadPOFileSync(file)
{
	let content = fs.readFileSync(file, {encoding: 'utf8'});
	content = stripBOM(content);
	return i18ncPO.parse(content);
}
