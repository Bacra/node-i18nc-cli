'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));

var glob = require('glob');

var debug = require('debug')('i18nc:load_po_files');

var i18ncPO = require('i18nc-po');

var stripBOM = require('strip-bom');

var extend = require('extend');

var globAsync = Promise.promisify(glob);
exports.autoLoadPOFiles = autoLoadPOFiles;
exports.loadPOFiles = loadPOFiles;
exports.loadPOFile = loadPOFile;
exports.autoLoadPOFilesSync = autoLoadPOFilesSync;
exports.loadPOFilesSync = loadPOFilesSync;
exports.loadPOFileSync = loadPOFileSync;

function autoLoadPOFiles(_x) {
  return _autoLoadPOFiles.apply(this, arguments);
}
/**
 * 从po文件中读取dbTranslateWords结构体
 */


function _autoLoadPOFiles() {
  _autoLoadPOFiles = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(input) {
    var stats;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fs.statAsync(input);

          case 2:
            stats = _context.sent;

            if (!stats.isFile()) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", loadPOFile(input));

          case 7:
            if (!stats.isDirectory()) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", loadPOFiles(input));

          case 11:
            throw new Error('Input Is Not File Or Directory');

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _autoLoadPOFiles.apply(this, arguments);
}

function loadPOFiles(_x2) {
  return _loadPOFiles.apply(this, arguments);
}

function _loadPOFiles() {
  _loadPOFiles = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(inputDir) {
    var files, arr;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            debug('sacn dir:%s', inputDir);
            _context2.next = 3;
            return globAsync('**/*.po', {
              cwd: inputDir,
              nodir: true,
              absolute: true
            });

          case 3:
            files = _context2.sent;
            _context2.next = 6;
            return Promise.map(files, function (file) {
              debug('load po file:%s', file);
              return loadPOFile(file);
            }, {
              concurrency: 5
            });

          case 6:
            arr = _context2.sent;
            arr.unshift(true);
            return _context2.abrupt("return", extend.apply(null, arr));

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _loadPOFiles.apply(this, arguments);
}

function loadPOFile(_x3) {
  return _loadPOFile.apply(this, arguments);
}

function _loadPOFile() {
  _loadPOFile = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(file) {
    var content;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return fs.readFileAsync(file, {
              encoding: 'utf8'
            });

          case 2:
            content = _context3.sent;
            content = stripBOM(content);
            return _context3.abrupt("return", i18ncPO.parse(content));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _loadPOFile.apply(this, arguments);
}

function autoLoadPOFilesSync(input) {
  var stats = fs.statSync(input);
  if (stats.isFile()) return loadPOFileSync(input);else if (stats.isDirectory()) return loadPOFilesSync(input);else throw new Error('Input Is Not File Or Directory');
}
/**
 * 从po文件中读取dbTranslateWords结构体
 */


function loadPOFilesSync(inputDir) {
  debug('sacn dir:%s', inputDir);
  var files = glob.sync('**/*.po', {
    cwd: inputDir,
    nodir: true,
    absolute: true
  });
  var arr = files.map(loadPOFileSync);
  arr.unshift(true);
  return extend.apply(null, arr);
}

function loadPOFileSync(file) {
  var content = fs.readFileSync(file, {
    encoding: 'utf8'
  });
  content = stripBOM(content);
  return i18ncPO.parse(content);
}
//# sourceMappingURL=load_po_files.js.map