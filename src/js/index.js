import Utility from './utility.js';

var sortCityFromRaw = function(raw) {
	let keys = Object.keys(raw),
	    cities = [];
	keys.forEach(key => {
		let citiesByArea = raw[key].map(city => {
			return city.city;
		});
		cities = cities.concat(citiesByArea);
	});
	main(cities);
};

var fetchFailedHandler = function(err) {
	console.log(`Error State: ${err}, fetch tz.json failed!`);
	main([]);
};

Utility.getJSONFrom('../assets/tz.json').then(sortCityFromRaw, fetchFailedHandler);

var main = function(cities){
	console.log(cities);
}