import Utility from './utility.js';
import CONSTANTS from './constants.js';

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
	Array.prototype.forEach.call(lists, (list, index) => {
		if(index === 0) {
			Utility.addClass(list, 'selected');
		}
		Utility.addEvent(list, 'mouseover', (e) => {
			Array.prototype.forEach.call(lists, dom => {
				Utility.removeClass(dom, 'selected');
			});
			Utility.addClass(e.target, 'selected');
		});
		Utility.addEvent(list, 'click', listSelectedHandler);
	});
};

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
};

var addInputInteraction = function(inputDOM, cities, event) {
	let filteredCities = filterCity(inputDOM.value, cities),
	    suggestions = document.querySelector('.suggestions');

	if(!Utility.hasClass(suggestions, 'hide') && (event.keyCode === CONSTANTS.UP || event.keyCode === CONSTANTS.DOWN || event.keyCode === CONSTANTS.ENTER)){
		event.preventDefault();
		switch (event.keyCode) {
			case CONSTANTS.UP:
			    addSelectedToSibilingNode(CONSTANTS.PREVIOUS);
			    break;
			case CONSTANTS.DOWN:
			    addSelectedToSibilingNode(CONSTANTS.NEXT);
			    break;
			default:
			    let selectedContent = document.querySelector('.selected').textContent;
			    addTagToInput(selectedContent);
		}
	}else{
	    renderSuggestions(suggestions, filteredCities);
	    addListInteraction();
	}
};

var addSelectedToSibilingNode = function(direction) {
	let selected = document.querySelector('.selected'),
	    allSuggestionItems = document.querySelectorAll('.suggestion-item');

	if(direction === CONSTANTS.PREVIOUS && selected !== allSuggestionItems[0]){
		Utility.removeClass(selected, 'selected');
		Utility.addClass(selected.previousSibling, 'selected');
	}
	if(direction === CONSTANTS.NEXT && selected !== allSuggestionItems[allSuggestionItems.length-1]){
		Utility.removeClass(selected, 'selected');
		Utility.addClass(selected.nextSibling, 'selected');
	}
};

var addTagToInput = function(content) {
	let inputTag = document.querySelector('.tag-input'),
	    newTag = Utility.createTagElement(content),
	    isRepetitive = Array.prototype.some.call(document.querySelectorAll('.tag'), node => {
		    return node.textContent.slice(0, -1) === content;
	    });
	if(!isRepetitive){
		inputTag.parentNode.insertBefore(newTag, inputTag);
	}
	document.querySelector('.tag-input').value = '';
	Utility.addClass(document.querySelector('.suggestions'), 'hide');
	addRemoveInteraction();
};

var listSelectedHandler = function(e) {
	addTagToInput(e.target.textContent);
};

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
	dom.style.top = `${inputTop + CONSTANTS.TOP_OFFSET}px`;
	dom.style.left = `${inputLeft - CONSTANTS.LEFT_OFFSET}px`;
	Utility.removeAllChildNodes(dom);
	list.forEach(city => {
		dom.appendChild(Utility.createListElement(city));
	});
	Utility.removeClass(dom, 'hide');
	if(list.length === 0){
		Utility.addClass(dom, 'hide');
	}
};

var main = function(cities){
	let inputTag = document.querySelector('.tag-input');

	let handleInputKeyUp = function(e){
		addInputInteraction(inputTag, cities, e);
	};

	Utility.addEvent(inputTag, 'keyup', handleInputKeyUp);
};

Utility.getJSONFrom('../assets/tz.json', sortCityFromRaw, fetchFailedHandler);
