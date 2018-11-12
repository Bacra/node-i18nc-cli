'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const glob = Promise.promisify(require('glob'));
const path = require('path');
const ignore = require('ignore');
const i18nc = require('i18nc');
const debug = require('debug')('i18nc:cli_scan');

exports.dir = async function(dir)
{
	let filelist = await glob(dir, {});
	let subdirConfigs = {};
	let ignoreConfigs = {};

	let results = await Promise.map(filelist, async function(file)
		{
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
			return {file, config: arr[0]};
		},
		{
			concurrency: 5
		});

	return results.filter(function(val)
		{
			return val;
		});
}

exports.file = async function(file)
{
	let dirname = path.dirname(file);
	let configfile = dirname + '/' + '.i18ncrc.js';
	let config = await _checkAndLoadConfig(configfile);
	return {file, config};
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
		let buf = await fs.readFileAsync(file);
		let ig = new ignore();
		let hasIg = false;
		buf.toString().split(/\n/g).forEach(function(file)
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
			extConfigs.unshift(i18nc.extend(mainConfig));
			mainConfig = extConfigs.reduce(function(a, b)
			{
				return i18nc.extend(loadConfig(dirname + '/' + b), a);
			});
		}
	}

	return mainConfig;
}
