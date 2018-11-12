'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var debug = require('debug')('i18nc:cli_util');

var Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));
var glob = Promise.promisify(require('glob'));
var mkdirp = Promise.promisify(require('mkdirp'));

var path = require('path');

var i18nc = require('i18nc-core');

var stripBOM = require('strip-bom');

exports.scanFileList = scanFileList;

function scanFileList(_x, _x2) {
  return _scanFileList.apply(this, arguments);
}
/**
 * 写入一个文件，需要判断input本身的文件状态
 */


function _scanFileList() {
  _scanFileList = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(input, recurse) {
    var stats, files, file, _files;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fs.statAsync(input);

          case 3:
            stats = _context.sent;
            _context.next = 17;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);

            if (!(!_context.t0 || !_context.t0.code == 'ENOENT')) {
              _context.next = 10;
              break;
            }

            throw _context.t0;

          case 10:
            if (!(!recurse && input.indexOf('*') == -1)) {
              _context.next = 12;
              break;
            }

            throw _context.t0;

          case 12:
            debug('input is not exists, start glob');
            _context.next = 15;
            return glob(input, {
              nodir: true,
              realpath: true
            });

          case 15:
            files = _context.sent;
            return _context.abrupt("return", {
              type: 'list',
              data: files
            });

          case 17:
            if (!stats.isFile()) {
              _context.next = 25;
              break;
            }

            debug('input is file');
            _context.next = 21;
            return fs.realpathAsync(input);

          case 21:
            file = _context.sent;
            return _context.abrupt("return", {
              type: 'one',
              data: file
            });

          case 25:
            if (!stats.isDirectory()) {
              _context.next = 35;
              break;
            }

            debug('input is dir');

            if (recurse) {
              _context.next = 29;
              break;
            }

            throw new Error('Input Is A Directory');

          case 29:
            _context.next = 31;
            return glob('**/*', {
              cwd: input,
              nodir: true,
              realpath: true
            });

          case 31:
            _files = _context.sent;
            return _context.abrupt("return", {
              type: 'list',
              data: _files
            });

          case 35:
            throw new Error('Input Is Not File Or Directory');

          case 36:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 6]]);
  }));
  return _scanFileList.apply(this, arguments);
}

exports.getWriteOneFilePath = getWriteOneFilePath;

function getWriteOneFilePath(_x3, _x4) {
  return _getWriteOneFilePath.apply(this, arguments);
}

function _getWriteOneFilePath() {
  _getWriteOneFilePath = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(output, input) {
    var stats, tailStr, dir, rfile;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return fs.statAsync(output);

          case 3:
            stats = _context2.sent;
            _context2.next = 16;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);

            if (!(!_context2.t0 || _context2.t0.code != 'ENOENT')) {
              _context2.next = 10;
              break;
            }

            throw _context2.t0;

          case 10:
            debug('output is not exists'); // 当文件不存在的时候

            tailStr = output[output.length - 1];

            if (tailStr == '/' || tailStr == '\\') {
              debug('ouput maybe is path');
              dir = output;
              rfile = dir + path.basename(input);
            } else {
              dir = path.join(output, '..');
              rfile = output;
            }

            _context2.next = 15;
            return mkdirp(dir);

          case 15:
            return _context2.abrupt("return", rfile);

          case 16:
            if (!stats.isFile()) {
              _context2.next = 21;
              break;
            }

            debug('output is file');
            return _context2.abrupt("return", output);

          case 21:
            if (!stats.isDirectory()) {
              _context2.next = 26;
              break;
            }

            debug('output is dir');
            return _context2.abrupt("return", output + '/' + path.basename(input));

          case 26:
            throw new Error('Input Is Not File Or Directory');

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 6]]);
  }));
  return _getWriteOneFilePath.apply(this, arguments);
}

exports.file2i18nc = file2i18nc;

function file2i18nc(_x5, _x6) {
  return _file2i18nc.apply(this, arguments);
}

function _file2i18nc() {
  _file2i18nc = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(file, options) {
    var code;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return fs.readFileAsync(file, {
              encoding: 'utf8'
            });

          case 2:
            code = _context3.sent;
            return _context3.abrupt("return", i18nc(stripBOM(code), options));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _file2i18nc.apply(this, arguments);
}
//# sourceMappingURL=cli_util.js.map