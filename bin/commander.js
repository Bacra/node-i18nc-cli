var cwd        = process.cwd();
var program    = require('commander');
var codeAction = require('./actions/code');

module.exports = program;

program.version(
		' cli: v'+require('../package.json').version
		+ '\ncore: v'+require('../').version
	);


program.command('code <input> <output>')
	.description('insert I18N handler to code')
	.option('-d --dbfile [file]', 'dbfile path')
	.option('-w --output-word-file [file]', 'output translate words')
	.option('-o --output-po-dir [dir]', 'output po files dir')
	.option('-i --input-po-dir [dir]', 'input po files dir')
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
		if (args.r) input += '/**/*';

		codeAction(cwd, input, output, args)
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
