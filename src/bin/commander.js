'use strict';

const _               = require('lodash');
const program         = require('commander');
const codeAction      = require('./actions/code');
const checkWrapAction = require('./actions/check-wrap');
const refsAction      = require('./actions/refs');
const cliPrinter      = require('../util/cli_printer');

module.exports = program;

program.version(
		' cli: v'+require('../package.json').version
		+ '\ncore: v'+require('../').version
	);

program.command('code <input> <output>')
	.description('Warp code width I18N handler.')
	.option('-d --input-po-dir [dir]', 'Input po files dir')
	.option('   --input-po-file [file]', 'Input po files file')
	.option('   --translate-db-file [file]', 'Translate data db file')
	.option('-o --output-po-dir [dir]', 'Output po files dir')
	.option('   --output-word-file [file]', 'Output translate words')
	.option('-n --i18n-handler-name [name]', 'Custom I18N handler name')
	.option('   --i18n-handler-alias [name,name]', 'I18N handler alias', argsToArray)
	.option('   --ignore-scan-names [name,name]', 'Ignore cacn handler names', argsToArray)

	.option('   --only-check', 'Only check, not write code to file')
	.option('-r', 'Recurse into directories')

	.option('-c, --color', 'Enable colored output')
	.option('-C, --no-color', 'Disable colored output')
	.action(function(input, output, args)
	{
		let options = key2key(args,
			{
				'input-po-dir'       : 'inputPODir',
				'input-po-file'      : 'inputPOFile',
				'translate-db-file'  : 'translateDBFile',
				'output-po-dir'      : 'outputPODir',
				'output-word-file'   : 'outputWordFile',
				'i18n-handler-name'  : 'I18NHandlerName',
				'i18n-handler-alias' : 'I18NHandlerAlias',
				'ignore-scan-names'  : 'ignoreScanHandlerNames',
				'only-check'         : 'isOnlyCheck',
				'r'                  : 'isRecurse',
			});

		options.isPartialUpdate = !args.f;

		if (args.color === false) cliPrinter.colors.enabled = false;

		codeAction(input, output, options)
			.catch(function(err)
			{
				console.log(err.stack);
			});
	});


program.command('check-wrap <input>')
	.description('Check if all words were wrapped by I18N handler.')
	.option('-n --i18n-handler-name [name]', 'Custom I18N handler name')
	.option('   --i18n-handler-alias [name,name]', 'I18N handler alias', argsToArray)
	.option('   --ignore-scan-names [name,name]', 'Ignore cacn handler names', argsToArray)

	.option('-r', 'Recurse into directories')

	.option('-c, --color', 'Enable colored output')
	.option('-C, --no-color', 'Disable colored output')
	.action(function(input, args)
	{
		let options = key2key(args,
			{
				'i18n-handler-name'  : 'I18NHandlerName',
				'i18n-handler-alias' : 'I18NHandlerAlias',
				'ignore-scan-names'  : 'ignoreScanHandlerNames',
				'r'                  : 'isRecurse',
			});

		if (args.color === false) cliPrinter.colors.enabled = false;

		checkWrapAction(input, options)
			.catch(function(err)
			{
				console.log(err.stack);
			});
	});


program.command('refs <string>')
	.description('Parse refs in po files. <e.g.> "1,1,0,7,subtype,*"')
	.option('-C, --no-color', 'Disable colored output.')
	.action(function(string, args)
	{
		if (args.color === false) cliPrinter.colors.enabled = false;

		try {
			refsAction(string);
		}
		catch(err)
		{
			console.log(err.stack);
		}
	});

program.command('help <cmd>')
	.description('display help for [cmd]')
	.action(function(cmd)
	{
		let self = this;

		let command = findSubCommand(self.parent, cmd);
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
				.replace(/ +Options:\s+$/, '')
				+ '\n';
		});
	});


// find sub command
function findSubCommand(program, cmd)
{
	let command;
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

function key2key(obj, keyMap)
{
	let result = {};
	_.each(obj, function(val, key)
	{
		return result[keyMap[key] || key] = val;
	});
	return result;
}

function argsToArray(val)
{
	return val.split(',')
		.map(function(val){return val.trim()})
		.filter(function(val){return val});
}
