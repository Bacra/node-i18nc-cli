var _ = require('lodash');

exports.req = function(req)
{
	var lans = this.req.get('Accept-Language');
	if (lans)
	{
		var lanstr = [];
		lans.toLowerCase().split(',')
			.map(function(item, index)
			{
				var arr = item.split(';');
				var q = arr[1];
				var qval = q && q.substr(0, 2) == 'q=' && +q.substr(2);

				return {
					val		: arr[0],
					q		: qval,
					index	: index
				};
			})
			.sort(function(a, b)
			{
				if (!a.q && !b.q) return a.index > b.index ? -1 : 1;
				if (!a.q) return -1;
				if (!b.q) return 1;

				if (a.q == b.q) return a.index > b.index ? -1 : 1;

				return a.q > b.q ? -1 : 1;
			})
			.some(function(item)
			{
				var val = item.val;
				if (val == 'zh-cn') return true;

				if (DEFAULT_LANS[val])
				{
					lanstr = lanstr.concat(DEFAULT_LANS[val]);
				}

				lanstr.push(val);
			});

		lans = _.uniq(lanstr).join(',');
	}

	return lans;
}
