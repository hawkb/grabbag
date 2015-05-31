var Q = require('q'); // promises library

// crypto apis
var BTCE = require('btce');
var btce = new BTCE('YOUR-BTCE-KEY', 'YOUR-BTCE-SECRET');
var Cryptsy = require('cryptsy');
var cryptsy = new Cryptsy('YOUR-CRYPTSY-KEY', 'YOUR-CRYPTSY-SECRET');
var bittrex = require('node.bittrex.api');
bittrex.options({
    'apikey' : '',
    'apisecret' : '',
    'stream' : false,
    'verbose' : false,
    'cleartext' : false,
    'baseUrl' : 'https://bittrex.com/api/v1.1' // KEY!!!  v1.1 is current as of 7/20/15
});

// global variables for accumulating data
var best_buys = {'LTC/BTC':{}, 'PPC/BTC':{}, 'DSH/BTC':{}};
var best_markets = {};

// btce api should probably be replaced with cURL
// that way we can grab multiple markets with a single GET
// and parse inside a single function, like the other apis below
function btce_ticker(currency_pair, currency_key) {
	var deferred = Q.defer();
	btce.ticker({ pair: currency_pair }, function (err, data) {
		if (err) deferred.reject(err)
		else {
			best_buys[currency_key]['btce'] = data['ticker']['buy'];
			deferred.resolve( data['ticker'] );
		};
	});
	return deferred.promise;
}

function cryptsy_api() {
	var deferred = Q.defer();
	function sortPrice(a, b) { return a['price']-b['price']; };
	cryptsy.api('marketdatav2', null, function (err, data) {
		if (err) deferred.reject(err)
		else {
			var d = data['markets'];
			best_buys['LTC/BTC']['cryptsy'] = d['LTC/BTC']['sellorders'].sort(sortPrice)[0]['price'];
			best_buys['PPC/BTC']['cryptsy'] = d['PPC/BTC']['sellorders'].sort(sortPrice)[0]['price'];
			best_buys['DSH/BTC']['cryptsy'] = d['DASH/BTC']['sellorders'].sort(sortPrice)[0]['price'];
			deferred.resolve( d );
		};
	});
	return deferred.promise;
}

// no errors returned by bittrex api???
function bitrex_getmarketsummaries() {
	var deferred = Q.defer();
	bittrex.getmarketsummaries(function (data) {
		var markets = {'BTC-LTC':'LTC/BTC', 'BTC-DASH':'DSH/BTC', 'BTC-PPC':'PPC/BTC'}; // translate market keys for bittrex
		var len = data['result'].length
		for (i=0; i<len; i++) {
			var result = data['result'][i]; // returned list requires a double loop, unlike cryptsy
			for (var market in markets) {
				if (market===result['MarketName']) {
					best_buys[markets[market]]['bittrex'] = result['Ask'];
					break
				};
			};
		};
		deferred.resolve( data );
	});
	return deferred.promise;
}

// wait for all api calls to succeed, then find the best buy for each market
Q.all([cryptsy_api(),
	btce_ticker('ltc_btc', 'LTC/BTC'),
	btce_ticker('ppc_btc', 'PPC/BTC'),
	bitrex_getmarketsummaries()
	]).then(function (values) {
		for (var market in best_buys) {
			var best = 1000000000000.; // a bit hacky, but best market buy should obviously be less than this
			for (var exchange in best_buys[market]) {
				if (best_buys[market][exchange] < best) {
					best = best_buys[market][exchange];
					best_markets[market] = exchange;
				};
			};
		};
}).done(function (values) {
	console.log(best_buys);
	console.log(best_markets);
})
