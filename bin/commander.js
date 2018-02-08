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
	.option('-b --dbfile [file]', 'dbfile path')
	.option('-p --input-po-file [file]', 'input po files file')
	.option('-d --input-po-dir [dir]', 'input po files dir')
	.option('-w --output-word-file [file]', 'output translate words')
	.option('-o --output-po-dir [dir]', 'output po files dir')
	.option('-l --lans [lan1,lan2]', 'pick file languages', function(val)
		{
			return val.split(',')
				.map(function(val){return val.trim()})
				.filter(function(val){return val});
		})
	.option('-n --i18n-handler-name [name]', 'custom I18N handler name')
	.option('-c', 'only check')
	.option('-r', 'recurse into directories')
	.action(function(input, output, args)
	{
		var options = cliUtil.key2key(args,
			{
				'dbfile'            : 'dbfile',
				'input-po-file'     : 'inputPOFile',
				'input-po-dir'      : 'inputPODir',
				'output-word-file'  : 'outputWordFile',
				'output-po-dir'     : 'outputPODir',
				'lans'              : 'pickFileLanguages',
				'i18n-hanlder-name' : 'I18NHandlerName',
				'c'                 : 'isOnlyCheck',
				'r'                 : 'isRecurse',
			});

		codeAction(cwd, input, output, options)
			.catch(function(err)
			{
				console.log(err.stack);
			});
	});


program.command('check <input>')
	.description('Check if all words were wrapped by I18N handler')
	.option('-n --i18n-handler-name [name]', 'custom I18N handler name')
	.option('-r', 'recurse into directories')
	.action(function(input, args)
	{
		var options = cliUtil.key2key(args,
			{
				'i18n-handler-name' : 'I18NHandlerName',
				'r'                 : 'isRecurse',
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
