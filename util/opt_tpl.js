exports.webAndProcessDomain = function(cache)
{
	if (cache.global)
	{
		return cache.global.__i18n_lan__;
	}
	else if (cache.platform == 'node-process')
	{
		return process.domain && process.domain.__i18n_lan__;
	}
	else if (typeof window == 'object')
	{
		cache.global = window;

		if (!window.__i18n_lan__)
		{
			var nav = window.navigator;
			var navlans = nav && nav.languages;
			var navlan = nav && nav.language;
			var lan;
			if (navlans) lan = ''+navlans
			if (navlan) lan = navlan+navlan.split(/[-_]/)[0];
			if (lan)
			{
				window.__i18n_lan__ = lan.toLowerCase().replace(/-/g, '_');
			}
		}

		return window.__i18n_lan__;
	}
	else if (typeof process == 'object')
	{
		cache.platform == 'node-process';
		return process.domain && process.domain.__i18n_lan__;
	}
	else
	{
		cache.global = {};
	}
}

exports.onlyWeb = function(cache)
{
	if (!window.__i18n_lan__)
	{
		var nav = window.navigator;
		var navlans = nav && nav.languages;
		var navlan = nav && nav.language;
		var lan;
		if (navlans) lan = ''+navlans
		if (navlan) lan = navlan+navlan.split(/[-_]/)[0];
		if (lan)
		{
			window.__i18n_lan__ = lan.toLowerCase().replace(/-/g, '_');
		}
	}

	return window.__i18n_lan__;
}
