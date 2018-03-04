var Promise   = require('bluebird');
var _         = require('lodash');
var fs        = Promise.promisifyAll(require('fs'));
var mkdirp    = Promise.promisify(require('mkdirp'));
var debug     = require('debug')('i18nc:fileresult');
var i18ncPO   = require('i18nc-po');


exports.mulitResult2POFiles = mulitResult2POFiles;

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
			var poPromises = Promise.map(_.keys(output.po), function(lan)
				{
					var file = outputDir+'/'+lan+'.po';
					return fs.writeFileAsync(file, output.po[lan]);
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
