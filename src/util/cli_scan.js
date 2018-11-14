'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const glob = Promise.promisify(require('glob'));
const path = require('path');
const ignore = require('ignore');
const i18ncOptions = require('i18nc-options');
const debug = require('debug')('i18nc:cli_scan');
const stripBOM = require('strip-bom');

/**
 * 扫描一个目录下所有符合要求的文件，同时返回可能的配置文件
 * @param  {String} dir 扫描目录
 * @return {ResultObject}
 */
exports.dir = async function(dir)
{
	let filelist = await glob(dir, {nodir: true});
	let results = await exports.files(filelist);

	return results;
}

/**
 * 扫描文件列表，并返回可用的文件和对一个的配置
 * @param  {Array} filelist 文件列表
 * @return {ResultObject}
 */
exports.files = async function(filelist)
{
	let subdirConfigs = {};
	let ignoreConfigs = {};
	let results = new ResultObject();

	await Promise.map(filelist, async function(file)
	{
		let filename = path.basename(file);
		if (filename == '.i18ncrc.js' || filename == '.i18ncignore')
		{
			debug('ignore rcfile: %s', file);
			return;
		}

		let dirname = path.dirname(file);

		let configfile = dirname + '/' + '.i18ncrc.js';
		let configPo = subdirConfigs[configfile]
			|| (subdirConfigs[configfile] = _checkAndLoadConfig(configfile));

		let ignorefile = dirname + '/' + '.i18ncignore';
		let ignorePo = ignoreConfigs[ignorefile]
			|| (ignoreConfigs[ignorefile] = _checkAndLoadIgnore(ignorefile));

		let arr = await Promise.all([configPo, ignorePo]);

		if (arr[1] && arr[1].ignores(file))
		{
			debug('ignore file: %s', file);
			return;
		}

		results.add(new FileItem({file, config: arr[0]}));
	},
	{
		concurrency: 5
	});

	return results;
}


/**
 * 获取一个文件的配置信息
 * @param  {String} file 文件路径
 * @return {FileItem}
 */
exports.file = async function(file)
{
	let dirname = path.dirname(file);
	let configfile = dirname + '/' + '.i18ncrc.js';
	let config = await _checkAndLoadConfig(configfile);
	return new FileItem({file, config});
}

exports.loadConfig = loadConfig;
async function loadConfig(file)
{
	let mainConfig = require(file);
	let extConfigs = mainConfig.extends;
	if (extConfigs)
	{
		let dirname = path.dirname(file);
		extConfigs = Array.isArray(extConfigs) ? extConfigs : [extConfigs];
		if (extConfigs.length)
		{
			extConfigs.unshift(i18ncOptions.init(mainConfig));
			mainConfig = extConfigs.reduce(function(a, b)
			{
				return i18ncOptions.extend(loadConfig(dirname + '/' + b), a);
			});
		}
	}

	return mainConfig;
}



class ResultObject
{
	constructor(list)
	{
		this.list = list || [];
	}

	toJSON()
	{
		return this.list.map((item) => {
			return item.toJSON();
		});
	}

	add(item)
	{
		this.list.push(item);
	}
}


class FileItem
{
	constructor(data)
	{
		this.data = data;
	}

	get file()
	{
		return this.data.file;
	}

	get config()
	{
		return this.data.config;
	}

	toString()
	{
		return this.data.file;
	}

	toJSON()
	{
		return this.toString();
	}

	extend(options)
	{
		return i18ncOptions.extend(this.config, options);
	}
}



async function _checkAndLoadConfig(file)
{
	try {
		let stats = await fs.statAsync(file);
		if (!stats.isFile())
		{
			debug('configfile is not file: %s', file);
			file = null;
		}
	}
	catch(err)
	{
		debug('get configfile is err:%o', err);
		file = null;
	}

	if (file)
	{
		let config = await loadConfig(file);
		return config;
	}
}

async function _checkAndLoadIgnore(file)
{
	try {
		let stats = await fs.statAsync(file);
		if (!stats.isFile())
		{
			debug('ignore is not file: %s', file);
			file = null;
		}
	}
	catch(err)
	{
		debug('get ignore is err:%o', err);
		file = null;
	}

	if (file)
	{
		let buf = await fs.readFileAsync(file, {
			encoding: 'utf8'
		});

		let ig = new ignore();
		let hasIg = false;
		stripBOM(buf).split(/\n/g)
			.forEach(function(file)
			{
				file = file.trim();
				if (file)
				{
					hasIg = true;
					ig.add(file);
				}
			});

		if (hasIg) return ig;
	}
}
