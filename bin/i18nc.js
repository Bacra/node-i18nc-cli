#!/usr/bin/env node

'use strict';
process.title = 'i18nc';

var cwd		= process.cwd();
var program	= require('commander');
var actions	= require('../lib/main');

program
	.version(
		' cli: v'+require('../package.json').version
		+ '\ncore: v'+require('../').version
	)
	.command('code <input> <output>')
	.option('-d --dbfile [dbfile]', 'dbfile path')
	.option('-w --output-words [output-words]', 'output translate words')
	.action(function(input, output, args)
	{
		actions.code(cwd, input, output, args)
			.catch(function(err)
			{
				console.log(err.stack);
			});
	});


program.parse(process.argv);
