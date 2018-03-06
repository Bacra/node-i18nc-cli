var _ = require('lodash');

exports.mulitResult2POFiles = require('./fileresult').mulitResult2POFiles;
exports.refs = require('i18nc-po/lib/refs_utils');
exports.cli = require('./cli_printer');
_.extend(exports, require('./load_po_files'));
