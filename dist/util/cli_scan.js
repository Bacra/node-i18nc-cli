'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));
var glob = Promise.promisify(require('glob'));

var path = require('path');

var ignore = require('ignore');

var i18nc = require('i18nc');

var debug = require('debug')('i18nc:cli_scan');

exports.dir =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(dir) {
    var filelist, subdirConfigs, ignoreConfigs, results;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return glob(dir, {});

          case 2:
            filelist = _context2.sent;
            subdirConfigs = {};
            ignoreConfigs = {};
            _context2.next = 7;
            return Promise.map(filelist,
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(file) {
                var dirname, configfile, configPo, ignorefile, ignorePo, arr;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        dirname = path.dirname(file);
                        configfile = dirname + '/' + '.i18ncrc.js';
                        configPo = subdirConfigs[configfile] || (subdirConfigs[configfile] = _checkAndLoadConfig(configfile));
                        ignorefile = dirname + '/' + '.i18ncignore';
                        ignorePo = ignoreConfigs[ignorefile] || (ignoreConfigs[ignorefile] = _checkAndLoadIgnore(ignorefile));
                        _context.next = 7;
                        return Promise.all([configPo, ignorePo]);

                      case 7:
                        arr = _context.sent;

                        if (!(arr[1] && arr[1].ignores(file))) {
                          _context.next = 11;
                          break;
                        }

                        debug('ignore file: %s', file);
                        return _context.abrupt("return");

                      case 11:
                        return _context.abrupt("return", {
                          file: file,
                          config: arr[0]
                        });

                      case 12:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }(), {
              concurrency: 5
            });

          case 7:
            results = _context2.sent;
            return _context2.abrupt("return", results.filter(function (val) {
              return val;
            }));

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.file =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(file) {
    var dirname, configfile, config;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            dirname = path.dirname(file);
            configfile = dirname + '/' + '.i18ncrc.js';
            _context3.next = 4;
            return _checkAndLoadConfig(configfile);

          case 4:
            config = _context3.sent;
            return _context3.abrupt("return", {
              file: file,
              config: config
            });

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}();

function _checkAndLoadConfig(_x4) {
  return _checkAndLoadConfig2.apply(this, arguments);
}

function _checkAndLoadConfig2() {
  _checkAndLoadConfig2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(file) {
    var stats, config;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return fs.statAsync(file);

          case 3:
            stats = _context4.sent;

            if (!stats.isFile()) {
              debug('configfile is not file: %s', file);
              file = null;
            }

            _context4.next = 11;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            debug('get configfile is err:%o', _context4.t0);
            file = null;

          case 11:
            if (!file) {
              _context4.next = 16;
              break;
            }

            _context4.next = 14;
            return loadConfig(file);

          case 14:
            config = _context4.sent;
            return _context4.abrupt("return", config);

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 7]]);
  }));
  return _checkAndLoadConfig2.apply(this, arguments);
}

function _checkAndLoadIgnore(_x5) {
  return _checkAndLoadIgnore2.apply(this, arguments);
}

function _checkAndLoadIgnore2() {
  _checkAndLoadIgnore2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5(file) {
    var stats, buf, ig, hasIg;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return fs.statAsync(file);

          case 3:
            stats = _context5.sent;

            if (!stats.isFile()) {
              debug('ignore is not file: %s', file);
              file = null;
            }

            _context5.next = 11;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            debug('get ignore is err:%o', _context5.t0);
            file = null;

          case 11:
            if (!file) {
              _context5.next = 20;
              break;
            }

            _context5.next = 14;
            return fs.readFileAsync(file);

          case 14:
            buf = _context5.sent;
            ig = new ignore();
            hasIg = false;
            buf.toString().split(/\n/g).forEach(function (file) {
              file = file.trim();

              if (file) {
                hasIg = true;
                ig.add(file);
              }
            });

            if (!hasIg) {
              _context5.next = 20;
              break;
            }

            return _context5.abrupt("return", ig);

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 7]]);
  }));
  return _checkAndLoadIgnore2.apply(this, arguments);
}

exports.loadConfig = loadConfig;

function loadConfig(_x6) {
  return _loadConfig.apply(this, arguments);
}

function _loadConfig() {
  _loadConfig = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee6(file) {
    var mainConfig, extConfigs, dirname;
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            mainConfig = require(file);
            extConfigs = mainConfig.extends;

            if (extConfigs) {
              dirname = path.dirname(file);
              extConfigs = Array.isArray(extConfigs) ? extConfigs : [extConfigs];

              if (extConfigs.length) {
                extConfigs.unshift(i18nc.extend(mainConfig));
                mainConfig = extConfigs.reduce(function (a, b) {
                  return i18nc.extend(loadConfig(dirname + '/' + b), a);
                });
              }
            }

            return _context6.abrupt("return", mainConfig);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return _loadConfig.apply(this, arguments);
}
//# sourceMappingURL=cli_scan.js.map