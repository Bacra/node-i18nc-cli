'use strict';

const expect = require('expect.js');
const getlans = require('../../test/i18n_getlans');
const Domain = require('domain');


describe('#opt_tpl', function()
{
	it('#webCookeAndProcssDomian', function()
	{
		let dm = Domain.create();
		dm.run(function()
		{
			dm.__i18n_lan__ = 'zh-tw,cht';
			let cache = {};
			expect(getlans.webCookeAndProcssDomian(cache)).to.be('zh-tw,cht');
			expect(cache.p).to.be(1);
			expect(getlans.webCookeAndProcssDomian(cache)).to.be('zh-tw,cht');
		});
	});

	it('#webNavigatorAndProcessDomain', function()
	{
		let dm = Domain.create();
		dm.run(function()
		{
			dm.__i18n_lan__ = 'zh-tw,cht';
			let cache = {};
			expect(getlans.webNavigatorAndProcessDomain(cache)).to.be('zh-tw,cht');
			expect(cache.p).to.be(1);
			expect(getlans.webNavigatorAndProcessDomain(cache)).to.be('zh-tw,cht');
		});
	});
});
