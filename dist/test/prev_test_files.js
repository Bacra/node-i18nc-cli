'use strict';

var _ = require('lodash');

var fs = require('fs');

var mkdirp = require('mkdirp');

var optTpl = require('../../global/lib/getlans_opt.tpl.js');

var renders = exports.renders = {};
var INPUT_PATH = __dirname + '/../../global/test/input/'; // const OUTPUT_PATH = __dirname+'/../../global/test/input/';

['webNavigatorAndProcessDomain', 'webCookeAndProcssDomian', 'onlyWebCookie', 'onlyWebNavigator'].forEach(function (name) {
  var code = optTpl[name].toString();

  renders[name] = function (vars) {
    return code.replace(/\$LanguageVars\.([\w$]+)\$/g, function (all, name) {
      return vars[name];
    });
  };
});

function main() {
  var p = INPUT_PATH + 'opt_tpl/';
  mkdirp.sync(p);

  _.each(renders, function (render, filename) {
    var code = render({
      name: '__i18n_lan__',
      cookie: 'test_lan'
    });
    code = "'use strict';\n\n" + 'module.exports = ' + code;
    fs.writeFileSync(p + filename + '.js', code);
  });
}

if (process.mainModule === module) main();