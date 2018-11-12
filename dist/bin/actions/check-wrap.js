'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Promise = require('bluebird');

var path = require('path');

var debug = require('debug')('i18nc:check');

var cliUtil = require('../cli_util');

var cliPrinter = require('../../util/cli_printer');

module.exports =
/*#__PURE__*/
function () {
  var _checkWrap = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(input, options) {
    var fileInfo, myOptions, files, results;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return cliUtil.scanFileList(path.resolve(input), options.isRecurse);

          case 2:
            fileInfo = _context2.sent;
            myOptions = {
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
                insert: {
                  checkClosure: options.isCheckClosureForNewI18NHandler
                }
              }
            };
            files = fileInfo.type == 'list' ? fileInfo.data : [fileInfo.data];
            _context2.next = 7;
            return Promise.map(files,
            /*#__PURE__*/
            function () {
              var _ref = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(file) {
                var result, newlist, dirtyWords;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        debug('i18n file start: %s', file);
                        _context.next = 3;
                        return cliUtil.file2i18nc(file, myOptions);

                      case 3:
                        result = _context.sent;
                        newlist = result.allCodeTranslateWords().list4newWordAsts();
                        dirtyWords = result.allDirtyWords();
                        return _context.abrupt("return", {
                          file: file,
                          newlist: newlist,
                          dirtyWords: dirtyWords
                        });

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x3) {
                return _ref.apply(this, arguments);
              };
            }(), {
              concurrency: 5
            });

          case 7:
            results = _context2.sent;
            results.forEach(_printResult);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function checkWrap(_x, _x2) {
    return _checkWrap.apply(this, arguments);
  };
}();

function _printResult(item) {
  if (!item.newlist.length && !item.dirtyWords.list.length) {
    console.log('  ' + cliPrinter.colors.green('ok') + ' ' + item.file);
  } else {
    console.log('  ' + cliPrinter.colors.red('fail') + ' ' + item.file);
    var output = cliPrinter.printDirtyAndNewWords(item.dirtyWords, item.newlist, 7);
    console.log(output);
  }
}
//# sourceMappingURL=check-wrap.js.map