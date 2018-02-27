var Promise   = require('bluebird');
var _         = require('lodash');
var fs        = Promise.promisifyAll(require('fs'));
var mkdirp    = Promise.promisify(require('mkdirp'));
var debug     = require('debug')('i18nc:utils');
var i18ncPO   = require('i18nc-po');


exports.mulitResult2POFiles = mulitResult2POFiles;
exports.isAllI18NHandlerWrap = isAllI18NHandlerWrap;

_.extend(exports, require('./load_po_files'));

/**
 * 将很多个文件解析的结果，打包成一组po文件
 * data的格式为 {filepath: <i18nc ret>}
 */
function mulitResult2POFiles(data, outputDir, options)
{
	var output = i18ncPO.create({subScopeDatas: _.values(data)}, options);

	return mkdirp(outputDir)
		.then(function()
		{
			var poPromises = Promise.map(_.keys(output.po), function(file)
				{
					var file = outputDir+'/'+file+'.po';
					return fs.writeFileAsync(file, output.po[file]);
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
 * 检查代码中的翻译文本，是否全部使用I18N函数包裹
 * 使用i18nc处理结果进行分析
 */
function isAllI18NHandlerWrap(json)
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
				return !isAllI18NHandlerWrap(json2);
			});
	}

	return true;
}
