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
	main(cities.sort());
};

var fetchFailedHandler = function(err) {
	console.log(`Error State: ${err}, fetch tz.json failed!`);
	main([]);
};

var renderSuggestions = function(dom, list) {
	removeAllChildNodes(dom);
    list.forEach(city => {
    	dom.appendChild(createListElement(city));
    });
    Utility.removeClass(dom, 'hide');
    if(list.length === 0){
    	Utility.addClass(dom, 'hide');
    }
};

var createListElement = function(content) {
	let node = document.createElement('li'),
	    text = document.createTextNode(content);
	node.appendChild(text);
	return node;
};

var removeAllChildNodes = function(dom) {
	while (dom.firstChild) {
	    dom.removeChild(dom.firstChild);
	}
}

var main = function(cities){


	let inputTag = document.querySelector('.tag-input');
	let suggestions = document.querySelector('.suggestions');



	let handleInputKeyUp = function(e){
		let regExp = new RegExp(`^${inputTag.value}`, 'i');
		let filteredCities = cities.filter(city => regExp.test(city));
		filteredCities = filteredCities.length === cities.length ? [] : filteredCities;

		renderSuggestions(suggestions, filteredCities);
	}





	Utility.addEvent(inputTag, 'keyup', handleInputKeyUp);
};

Utility.getJSONFrom('../assets/tz.json', sortCityFromRaw, fetchFailedHandler);
