/* global window document */

'use strict';

exports.webAndProcessDomain
	= exports.webNavigatorAndProcessDomain
	= function(cache)
{
	if (cache.global)
	{
		return cache.global.__i18n_lan__;
	}
	else if (cache.platform == 'node-process')
	{
		var dm = process.domain;
		return dm && dm.__i18n_lan__;
	}
	else if (typeof window == 'object')
	{
		var win = window;
		cache.global = win;
		var lan = win.__i18n_lan__;

		if (!lan && lan !== false)
		{
			var nav = win.navigator;
			var navlans = nav && nav.languages;
			var navlan = nav && nav.language;
			if (navlans) lan = ''+navlans
			else if (navlan) lan = navlan+','+navlan.split(/[-_]/)[0];

			if (lan)
				lan = win.__i18n_lan__ = lan.toLowerCase().replace(/-/g, '_');
			else
				win.__i18n_lan__ = false;
		}

		return lan;
	}
	else if (typeof process == 'object')
	{
		cache.platform == 'node-process';
		var dm = process.domain;
		return dm && dm.__i18n_lan__;
	}
	else
	{
		cache.global = {};
	}
};

exports.webCookeAndProcssDomian = function(cache)
{
	if (cache.global)
	{
		return cache.global.__i18n_lan__;
	}
	else if (cache.platform == 'node-process')
	{
		var dm = process.domain;
		return dm && dm.__i18n_lan__;
	}
	else if (typeof window == 'object')
	{
		var win = window;
		cache.global = win;
		var lan = win.__i18n_lan__;

		if (!lan && lan !== false)
		{
			// 最好修改cookie的key
			lan = document.cookie.match(/(?:^|;) *__i18n_lan__=([^;]+)/);
			if (lan) lan = decodeURIComponent(lan[1]);
			win.__i18n_lan__ = lan || false;
		}

		return lan;
	}
	else if (typeof process == 'object')
	{
		cache.platform == 'node-process';
		var dm = process.domain;
		return dm && dm.__i18n_lan__;
	}
	else
	{
		cache.global = {};
	}
};

exports.onlyWebCookie = function()
{
	var win = window;
	var lan = win.__i18n_lan__;

	if (!lan && lan !== false)
	{
		// 最好修改cookie的key
		lan = document.cookie.match(/(?:^|;) *__i18n_lan__=([^;]+)/);
		if (lan) lan = decodeURIComponent(lan[1]);
		win.__i18n_lan__ = lan || false;
	}

	return lan;
};

exports.onlyWeb
	= exports.onlyWebNavigator
	= function()
{
	var win = window;
	var lan = win.__i18n_lan__;

	if (!lan && lan !== false)
	{
		var nav = win.navigator;
		var navlans = nav && nav.languages;
		var navlan = nav && nav.language;
		if (navlans) lan = ''+navlans
		else if (navlan) lan = navlan+','+navlan.split(/[-_]/)[0];

		if (lan)
			lan = win.__i18n_lan__ = lan.toLowerCase().replace(/-/g, '_');
		else
			win.__i18n_lan__ = false;
	}

	return lan;
};
