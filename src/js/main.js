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

var addListInteraction = function() {
	let lists = document.querySelectorAll('li');
	Array.prototype.forEach.call(lists, list => {
		Utility.addEvent(list, 'mouseover', (e) => {
			Array.prototype.forEach.call(lists, dom => {
				Utility.removeClass(dom, 'selected');
			});
			Utility.addClass(e.target, 'selected');
		});
		Utility.addEvent(list, 'click', listSelectedHandler);
	});
}

var addRemoveInteraction = function() {
	let removeButtons = document.querySelectorAll('.remove');
	Array.prototype.forEach.call(removeButtons, button => {
		Utility.addEvent(button, 'click', (e) => {
			let nodeToBeRemoved = e.target.parentNode;
			if(e.target.parentNode.parentNode){
				e.target.parentNode.parentNode.removeChild(nodeToBeRemoved);
			}
		});
	});
}

var addTagToInput = function(content) {
	let inputTag = document.querySelector('.tag-input');
	let newTag = Utility.createTagElement(content);
	inputTag.parentNode.insertBefore(newTag, inputTag);
}

var listSelectedHandler = function(e) {
	let isRepetitive = Array.prototype.some.call(document.querySelectorAll('.tag'), node => {
		return node.textContent.slice(0, -1) === e.target.textContent;
	});
	if(!isRepetitive){
		addTagToInput(e.target.textContent);
	}
	document.querySelector('.tag-input').value = '';
	Utility.addClass(document.querySelector('.suggestions'), 'hide');
	addRemoveInteraction();
}

var filterCity = function(condition, cities) {
	let regExp = new RegExp(`^${condition}`, 'i');
	let filteredCities = cities.filter(city => regExp.test(city));
	filteredCities = filteredCities.length === cities.length ? [] : filteredCities;
	return filteredCities;
};

var renderSuggestions = function(dom, list) {
	let inputTag = document.querySelector('.tag-input'),
		inputTop = inputTag.getBoundingClientRect().top,
		inputLeft = inputTag.getBoundingClientRect().left;
	dom.style.top = `${inputTop + 30}px`;
	dom.style.left = `${inputLeft - 10}px`;
	Utility.removeAllChildNodes(dom);
	list.forEach(city => {
		dom.appendChild(Utility.createListElement(city));
	});
	Utility.removeClass(dom, 'hide');
	if(list.length === 0){
		Utility.addClass(dom, 'hide');
	}
}

var main = function(cities){
	let inputTag = document.querySelector('.tag-input');
	let suggestions = document.querySelector('.suggestions');

	let handleInputKeyUp = function(e){
		let filteredCities = filterCity(inputTag.value, cities);
		renderSuggestions(suggestions, filteredCities);
		addListInteraction();
	}
	Utility.addEvent(inputTag, 'keyup', handleInputKeyUp);
};

Utility.getJSONFrom('../assets/tz.json', sortCityFromRaw, fetchFailedHandler);
