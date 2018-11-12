'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Promise = require('bluebird');

var debug = require('debug')('i18nc');

var fs = Promise.promisifyAll(require('fs'));
var mkdirp = Promise.promisify(require('mkdirp'));

var path = require('path');

var extend = require('extend');

var cliUtil = require('../cli_util');

var i18ncUtil = require('../../util/index');

module.exports =
/*#__PURE__*/
function () {
  var _code = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(input, output, options) {
    var translateDBFile, readTranslateDBFilePromise, allfiledata, data, fileInfo, dbTranslateWords, myOptions, file, _data, code, wfile, outputWordFile, writeOutputWordFilePromise, outputPODir;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            translateDBFile = options.translateDBFile;

            if (translateDBFile) {
              translateDBFile = path.resolve(translateDBFile);
              debug('read translateDBFile:%s', translateDBFile);
              readTranslateDBFilePromise = fs.readFileAsync(translateDBFile, {
                encoding: 'utf8'
              }).then(function (data) {
                return JSON.parse(data);
              });
            }

            allfiledata = {};
            _context2.next = 5;
            return Promise.all([cliUtil.scanFileList(path.resolve(input), null, options.isRecurse), readTranslateDBFilePromise, options.inputPOFile && i18ncUtil.loadPOFile(path.resolve(options.inputPOFile)), options.inputPODir && i18ncUtil.autoLoadPOFiles(path.resolve(options.inputPODir))]);

          case 5:
            data = _context2.sent;
            fileInfo = data[0];
            dbTranslateWords = extend(true, {}, data[2], data[3], data[1]);
            myOptions = {
              dbTranslateWords: dbTranslateWords,
              I18NHandlerName: options.I18NHandlerName,
              I18NHandlerAlias: options.I18NHandlerAlias,
              ignoreScanHandlerNames: options.ignoreScanHandlerNames,
              codeModifyItems: options.codeModifyItems,
              I18NHandler: {
                data: {
                  onlyTheseLanguages: options.onlyTheseLanguages
                },
                style: {
                  minFuncCode: options.minTranslateFuncCode
                },
                upgrade: {
                  partial: options.isPartialUpdate
                },
                insert: {
                  checkClosure: options.isCheckClosureForNewI18NHandler
                }
              }
            };

            if (!(fileInfo.type == 'list')) {
              _context2.next = 14;
              break;
            }

            _context2.next = 12;
            return Promise.map(fileInfo.data,
            /*#__PURE__*/
            function () {
              var _ref = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(file) {
                var data, code, wfile;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        debug('i18n file start: %s', file);
                        _context.next = 3;
                        return cliUtil.file2i18nc(file, myOptions);

                      case 3:
                        data = _context.sent;
                        code = data.code;
                        delete data.code;
                        allfiledata[file] = data;

                        if (!options.isOnlyCheck) {
                          _context.next = 9;
                          break;
                        }

                        return _context.abrupt("return");

                      case 9:
                        wfile = path.resolve(output, file);
                        debug('writefile: %s', wfile);
                        _context.next = 13;
                        return writeFile(wfile, code);

                      case 13:
                        console.log('write file: ' + wfile);

                      case 14:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x4) {
                return _ref.apply(this, arguments);
              };
            }(), {
              concurrency: 5
            });

          case 12:
            _context2.next = 32;
            break;

          case 14:
            file = fileInfo.data;
            debug('one file mod:%s', file);
            _context2.next = 18;
            return cliUtil.file2i18nc(file, myOptions);

          case 18:
            _data = _context2.sent;
            code = _data.code;
            delete _data.code;
            allfiledata[file] = _data;

            if (!options.isOnlyCheck) {
              _context2.next = 24;
              break;
            }

            return _context2.abrupt("return");

          case 24:
            wfile = path.resolve(output);
            debug('writefile: %s', wfile);
            _context2.next = 28;
            return cliUtil.getWriteOneFilePath(wfile, file);

          case 28:
            wfile = _context2.sent;
            _context2.next = 31;
            return fs.writeFileAsync(wfile, code);

          case 31:
            console.log('write file: ' + wfile);

          case 32:
            if (!options.isOnlyCheck) {
              _context2.next = 34;
              break;
            }

            return _context2.abrupt("return");

          case 34:
            outputWordFile = options.outputWordFile;

            if (outputWordFile) {
              outputWordFile = path.resolve(outputWordFile);
              writeOutputWordFilePromise = writeFile(outputWordFile, JSON.stringify(allfiledata, null, '\t')).then(function () {
                console.log('write words file: ' + outputWordFile);
              });
            }

            outputPODir = options.outputPODir;
            if (outputPODir) outputPODir = path.resolve(outputPODir);
            _context2.next = 40;
            return Promise.all([writeOutputWordFilePromise, outputPODir && i18ncUtil.mulitResult2POFiles(allfiledata, outputPODir, {
              pickFileLanguages: options.pickFileLanguages
            })]);

          case 40:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function code(_x, _x2, _x3) {
    return _code.apply(this, arguments);
  };
}();

function writeFile(_x5, _x6) {
  return _writeFile.apply(this, arguments);
}

function _writeFile() {
  _writeFile = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(file, content) {
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return mkdirp(path.dirname(file));

          case 2:
            _context3.next = 4;
            return fs.writeFileAsync(file, content);

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _writeFile.apply(this, arguments);
}
//# sourceMappingURL=code.js.map