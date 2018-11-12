'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Promise = require('bluebird');

var _ = require('lodash');

var fs = Promise.promisifyAll(require('fs'));
var mkdirp = Promise.promisify(require('mkdirp'));

var debug = require('debug')('i18nc:fileresult');

var i18ncPO = require('i18nc-po');

exports.mulitResult2POFiles = mulitResult2POFiles;
/**
 * 将很多个文件解析的结果，打包成一组po文件
 * data的格式为 {filepath: <i18nc ret>}
 */

function mulitResult2POFiles(_x, _x2, _x3) {
  return _mulitResult2POFiles.apply(this, arguments);
}

function _mulitResult2POFiles() {
  _mulitResult2POFiles = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(data, outputDir, options) {
    var subScopeDatas, CodeInfoResult, result, output, poPromises;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!options) options = {};
            subScopeDatas = _.values(data);

            if (!(!subScopeDatas || !subScopeDatas.length)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return");

          case 4:
            CodeInfoResult = subScopeDatas[0].constructor;
            result = new CodeInfoResult({
              subScopeDatas: subScopeDatas
            });
            output = i18ncPO.create(result, {
              title: options.poFileTitle,
              email: options.poFileEmail,
              existedTranslateFilter: options.existedTranslateFilter,
              onlyTheseLanguages: options.I18NHandler && options.I18NHandler.data && options.I18NHandler.data.onlyTheseLanguages
            });
            debug('output:%o', output);
            _context.next = 10;
            return mkdirp(outputDir);

          case 10:
            poPromises = Promise.map(_.keys(output.po), function (lan) {
              var file = outputDir + '/' + lan + '.po';
              return fs.writeFileAsync(file, output.po[lan]);
            }, {
              concurrency: 5
            });
            return _context.abrupt("return", Promise.all([fs.writeFileAsync(outputDir + '/lans.pot', output.pot), poPromises]));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _mulitResult2POFiles.apply(this, arguments);
}
//# sourceMappingURL=fileresult.js.map