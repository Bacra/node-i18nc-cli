var cwd         = process.cwd();
var program     = require('commander');
var cliUtil     = require('./cli_util');
var codeAction  = require('./actions/code');
var checkAction = require('./actions/check');

module.exports = program;

program.version(
		' cli: v'+require('../package.json').version
		+ '\ncore: v'+require('../').version
	);


program.command('code <input> <output>')
	.description('Warp code width I18N handler')
	.option('-d --input-po-dir [dir]', 'input po files dir')
	.option('   --input-po-file [file]', 'input po files file')
	.option('   --translate-db-file [file]', 'translate data db file')
	.option('-o --output-po-dir [dir]', 'output po files dir')
	.option('   --output-word-file [file]', 'output translate words')
	.option('-l --lans [lan1,lan2]', 'pick file languages', cliUtil.argsToArray)
	.option('-n --i18n-handler-name [name]', 'custom I18N handler name')
	.option('   --i18n-handler-alias [name,name]', 'I18N handler alias', cliUtil.argsToArray)
	.option('   --ignore-scan-names [name,name]', 'Ignore cacn handler names', cliUtil.argsToArray)
	.option('   --combo-literal-mode [mode]',
		[
			'combo closest literal before collect. Mode:',
			'NONE     : do nothing (default)',
			'LITERAL  : combo simple literal',
			'I18N     : combo simple literal and I18N callerr',
			'ALL_I18N : combo literal and I18N callerr (include subtype callerr)'
		]
		.join('\n'+new Array(45).join(' '))+'\n',
		/^(NONE|LITERAL|I18N|ALL_I18N)$/i)
	.option('-c', 'only check, not write code to file')
	.option('-r', 'recurse into directories')
	.option('-w', 'closure when I18N hanlder insert head')
	.option('-m', 'min Function translate code of I18N handler')
	.option('-f', 'force update total I18N Function. default:partial update')
	.action(function(input, output, args)
	{
		var options = cliUtil.key2key(args,
			{
				'input-po-dir'       : 'inputPODir',
				'input-po-file'      : 'inputPOFile',
				'translate-db-file'  : 'translateDBFile',
				'output-po-dir'      : 'outputPODir',
				'output-word-file'   : 'outputWordFile',
				'lans'               : 'pickFileLanguages',
				'i18n-hanlder-name'  : 'I18NHandlerName',
				'i18n-hanlder-alias' : 'I18NHandlerAlias',
				'ignore-scan-names'  : 'ignoreScanHandlerNames',
				'combo-literal-mode' : 'comboLiteralMode',
				'c'                  : 'isOnlyCheck',
				'r'                  : 'isRecurse',
				'w'                  : 'isClosureWhenInsertedHead',
				'm'                  : 'isMinFuncTranslateCode',
			});

		options.isPartialUpdate = !args.f;

		codeAction(cwd, input, output, options)
			.catch(function(err)
			{
				console.log(err.stack);
			});
	});


program.command('check-wrap <input>')
	.description('Check if all words were wrapped by I18N handler')
	.option('-n --i18n-handler-name [name]', 'custom I18N handler name')
	.option('   --i18n-handler-alias [name,name]', 'I18N handler alias', cliUtil.argsToArray)
	.option('   --ignore-scan-hanlder-names [name,name]', 'Ignore cacn handler names', cliUtil.argsToArray)
	.option('   --combo-literal-mode [mode]',
		[
			'combo closest literal before collect. Mode:',
			'NONE     : do nothing (default)',
			'LITERAL  : combo simple literal',
			'I18N     : combo simple literal and I18N callerr',
			'ALL_I18N : combo literal and I18N callerr (include subtype callerr)'
		]
		.join('\n'+new Array(45).join(' '))+'\n',
		/^(NONE|LITERAL|I18N|ALL_I18N)$/i)
	.option('-r', 'recurse into directories')
	.action(function(input, args)
	{
		var options = cliUtil.key2key(args,
			{
				'i18n-handler-name'  : 'I18NHandlerName',
				'i18n-hanlder-alias' : 'I18NHandlerAlias',
				'ignore-scan-names'  : 'ignoreScanHandlerNames',
				'combo-literal-mode' : 'comboLiteralMode',
				'r'                  : 'isRecurse',
			});
		checkAction(cwd, input, options)
			.catch(function(err)
			{
				console.log(err.stack);
			});
	});


program.command('help <cmd>')
	.description('display help for [cmd]')
	.action(function(cmd)
	{
		var self = this;

		var command = findSubCommand(self.parent, cmd);
		if (!command) throw new Error('No Defined Command, '+cmd);

		// command.help();
		// remove help info
		command.outputHelp(function(info)
		{
			return info
				// 删除Options下的help
				.replace(/ +-h, --help [^\n]+\n/, '')
				// 在命令行前加上父节点前缀
				.replace(/Usage: */, 'Usage: '+self.parent.name()+' ')
				// 如果没有多余的Options，就把这一项干掉
				.replace(/ +Options:\s+$/, '');
		});
	});


// find sub command
function findSubCommand(program, cmd)
{
	var command;
	program.commands.some(function(item)
	{
		if (item.name() == cmd || item.alias() == cmd)
		{
			command = item;
			return true;
		}
	});

	return command;
}
