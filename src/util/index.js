'use strict';

const _ = require('lodash');
const cli = exports.cli = require('./cli_printer');
cli.scan = require('./cli_scan');

exports.refs = require('i18nc-po/lib/refs_utils');
exports.opt =
{
	tpl: require('../../global/lib/getlans_opt.tpl.js')
};
exports.file = _.extend({}, require('./load_po_files'),
{
	mulitResult2POFiles: require('./fileresult').mulitResult2POFiles
});

exports.getlans = require('./getlans');
