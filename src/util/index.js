'use strict';

const cli = exports.cli = require('./cli_printer');
cli.scan = require('./cli_scan');

exports.refs = require('i18nc-po/lib/refs_utils');
exports.db = require('./load_db');
exports.output = require('./fileresult');
exports.getlans = require('./getlans');

exports.opt =
{
	tpl: require('../../tpl/getlans_opt.tpl.js')
};
