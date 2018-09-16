'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));

var expect = require('expect.js'); // var INPUT_PATH = __dirname+'/../../test/input/';


var OUTPUT_PATH = __dirname + '/../../test/output/';

exports.requireAfterWrite = function requireAfterWrite(filename, data) {
  var file = OUTPUT_PATH + filename;
  if (!process.env.TEST_BUILD) return require(file);

  if ((0, _typeof2.default)(data) == 'object') {
    data = JSON.stringify(data, null, '\t');
  }

  fs.writeFileSync(file, data);
  return require(file);
};

exports.code2arr = function code2arr(code) {
  return code.toString().split('\n').filter(function (val) {
    return val.trim();
  });
};

exports.diffFiles = function diffFiles(input, output) {
  return function (filename) {
    return Promise.all([fs.readFileAsync(input + '/' + filename, {
      encoding: 'utf8'
    }), fs.readFileAsync(output + '/' + filename, {
      encoding: 'utf8'
    })]).then(function (arr) {
      expect(exports.code2arr(arr[1])).to.eql(exports.code2arr(arr[0]));
    });
  };
};
//# sourceMappingURL=auto_test_utils.js.map