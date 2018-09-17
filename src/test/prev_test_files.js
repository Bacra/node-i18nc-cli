'use strict';

const _		= require('lodash');
const fs		= require('fs');
const mkdirp	= require('mkdirp');
const optTpl	= require('../../lib/getlans_opt.tpl.js');
const renders	= exports.renders = {};
const INPUT_PATH = __dirname+'/../../test/input/';
// const OUTPUT_PATH = __dirname+'/../../test/input/';


[
	'webNavigatorAndProcessDomain', 'webCookeAndProcssDomian',
	'onlyWebCookie', 'onlyWebNavigator'
]
.forEach(function(name)
{
	let code = optTpl[name].toString();

	renders[name] = function(vars)
	{
		return code.replace(/\$LanguageVars\.([\w$]+)\$/g, function(all, name)
		{
			return vars[name];
		});
	};
});


function main()
{
	let p = INPUT_PATH+'opt_tpl/';
	mkdirp.sync(p);

	_.each(renders, function(render, filename)
	{
		let code = render(
		{
			name: '__i18n_lan__',
			cookie: 'test_lan'
		});

		code = "'use strict';\n\n"+'module.exports = '+code;

		fs.writeFileSync(p+filename+'.js', code);
	});
}


if (process.mainModule === module) main();
