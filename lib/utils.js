var Promise  = require('bluebird');
var _        = require('lodash');
var fs       = Promise.promisifyAll(require('fs'));
var glob     = Promise.promisify(require('glob'));
var mkdirp   = Promise.promisify(require('mkdirp'));
var debug    = require('debug')('i18nc:utils');
var i18ncPO  = require('i18nc-po');
var stripBOM = require('strip-bom');
var path     = require('path');
var extend   = require('extend');


/**
 * 将很多个文件解析的结果，打包成一组po文件
 * data的格式为 {filepath: <i18nc ret>}
 */
exports.mulitResult2POFiles = mulitResult2POFiles;
function mulitResult2POFiles(data, outputDir, options)
{
	var output = i18ncPO.create({subScopeDatas: _.values(data)}, options);

	return mkdirp(outputDir)
		.then(function()
		{
			var poPromises = Promise.map(_.toPairs(output.po), function(item)
				{
					var file = item[0];
					var content = item[1];
					return fs.writeFileAsync(outputDir+'/'+file+'.po', content);
				},
				{
					concurrency: 5
				});

			return Promise.all(
				[
					fs.writeFileAsync(outputDir+'/lans.pot', output.pot),
					poPromises
				]);
		});
}


/**
 * 从po文件中读取dbTranslateWords结构体
 */
exports.loadPOFiles = loadPOFiles;
function loadPOFiles(inputDir)
{
	debug('sacn dir:%s', inputDir);
	return glob('**/*.po', {cwd: inputDir})
		.then(function(files)
		{
			return Promise.map(files, function(file)
			{
				var rfile = path.resolve(inputDir, file);
				debug('load po file:%s', rfile);
				return loadPOFile(rfile);
			},
			{
				concurrency: 5
			});
		})
		.then(function(arr)
		{
			arr.unshift(true);
			return extend.apply(null, arr);
		});
}

exports.loadPOFile = loadPOFile;
function loadPOFile(file)
{
	return fs.statAsync(file)
		.then(function(stat)
		{
			if (!stat.isFile())
			{
				debug('is not file:%s', file);
				return;
			}

			return fs.readFileAsync(file,
				{
					encoding: 'utf8'
				})
				.then(function(content)
				{
					content = stripBOM(content);
					return i18ncPO.parse(content);
				});
		});
}


/**
 * 检查代码中的翻译文本，是否全部使用I18N函数包裹
 * 使用i18nc处理结果进行分析
 */
exports.isI18NHandlerAllWrap = isI18NHandlerAllWrap;
function isI18NHandlerAllWrap(json)
{
	var codeArr = json.codeTranslateWords && json.codeTranslateWords.DEFAULTS;
	var argsArr = json.I18NArgsTranslateWords && json.I18NArgsTranslateWords.DEFAULTS;
	if (!codeArr && !argsArr && !json.subScopeDatas) return true;
	if (!argsArr && codeArr && codeArr.length) return false;
	if (!argsArr) argsArr = [];
	if (!codeArr) codeArr = [];
	if (codeArr.length != argsArr.length) return false;
	if (_.difference(codeArr, argsArr).length) return false;

	if (json.subScopeDatas)
	{
		return !_.some(json.subScopeDatas, function(json2)
			{
				return !isI18NHandlerAllWrap(json2);
			});
	}

	return true;
}
