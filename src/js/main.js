import Utility from './utility.js';
import CONSTANTS from './constants.js';

let sortCityFromRaw = function(raw) {
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

let fetchFailedHandler = function(err) {
	console.log(`Error State: ${err}, fetch tz.json failed!`);
	main([]);
};

let addListInteraction = function() {
	let lists = document.querySelectorAll('li');
	Array.prototype.forEach.call(lists, (list, index) => {
		if(index === 0) {
			Utility.addClass(list, 'selected');
		}
		Utility.addEvent(list, 'mouseover', (e) => {
			Utility.removeClass(document.querySelector('.selected'), 'selected');
			Utility.addClass(e.target, 'selected');
		});
		Utility.addEvent(list, 'click', listSelectedHandler);
	});
};

let addRemoveInteraction = function() {
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

let addInputInteraction = function(inputDOM, cities, event) {
	window.setTimeout(() => {
		let filteredCities,
		    suggestions = document.querySelector('.suggestions');

		if(!Utility.hasClass(suggestions, 'hide') && (event.keyCode === CONSTANTS.UP || event.keyCode === CONSTANTS.DOWN || event.keyCode === CONSTANTS.ENTER)){
			switch (event.keyCode) {
				case CONSTANTS.UP:
				    addSelectedToSibilingNode(CONSTANTS.PREVIOUS);
				    event.preventDefault();
				    break;
				case CONSTANTS.DOWN:
				    addSelectedToSibilingNode(CONSTANTS.NEXT);
				    event.preventDefault();
				    break;
				default:
				    let selectedContent = document.querySelector('.selected').textContent;
				    addTagToInput(selectedContent);
			}
		}else{
			filteredCities = filterCity(inputDOM.value, cities);
		    renderSuggestions(suggestions, filteredCities);
		    addListInteraction();
		}
	});
};

let addSelectedToSibilingNode = function(direction) {
	let selected = document.querySelector('.selected'),
	    allSuggestionItems = document.querySelectorAll('.suggestion-item'),
	    suggestionsWrapper = document.querySelector('.suggestions');

	if(direction === CONSTANTS.PREVIOUS && selected !== allSuggestionItems[0]){
		Utility.removeClass(selected, 'selected');
		Utility.addClass(selected.previousSibling, 'selected');
		scrollToChild(selected.previousSibling, suggestionsWrapper, CONSTANTS.PREVIOUS);
	}
	if(direction === CONSTANTS.NEXT && selected !== allSuggestionItems[allSuggestionItems.length-1]){
		Utility.removeClass(selected, 'selected');
		Utility.addClass(selected.nextSibling, 'selected');
		scrollToChild(selected.nextSibling, suggestionsWrapper, CONSTANTS.NEXT);
	}
};

let addTagToInput = function(content) {
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

let listSelectedHandler = function(e) {
	addTagToInput(e.target.textContent);
};

let filterCity = function(condition, cities) {
	condition = condition.indexOf('\\') >= 0 ? '' : condition;
	let regExp = new RegExp(`^${condition}`, 'i');
	let filteredCities = cities.filter(city => regExp.test(city));
	filteredCities = filteredCities.length === cities.length ? [] : filteredCities;
	return filteredCities;
};

let renderSuggestions = function(dom, list) {
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
	dom.scrollTop = 0;
	if(list.length === 0){
		Utility.addClass(dom, 'hide');
	}
};

let scrollToChild = function(child, parent, direction) {
	let parentPosition = parent.getBoundingClientRect(),
	    childPosition = child.getBoundingClientRect(),
	    parentBottom = parentPosition.top + parentPosition.height,
	    isChildLowerThanParentBottom = childPosition.top + childPosition.height > parentBottom,
	    isChildHigherThanParentTop = childPosition.top < parentPosition.top;

	if(direction === CONSTANTS.NEXT && isChildLowerThanParentBottom){
		parent.scrollTop += childPosition.height;
	}
	if(direction === CONSTANTS.PREVIOUS && isChildHigherThanParentTop){
		parent.scrollTop -= childPosition.height;
	}
};

let addSubmitInteraction = function(inputTag, cities, e) {
	let confirmTags = document.querySelectorAll('.tag'),
	    preTag = document.querySelector('.result'),
	    isInputValid = false,
	    result = [];

	Array.prototype.forEach.call(confirmTags, tag => {
		result.push(tag.textContent.slice(0, -1));
	});

	cities.forEach(city => {
		if(inputTag.value === city || inputTag.value === '') {
			isInputValid = true;
		}
	});

	isInputValid ? showResult(result) : showErrorMessage();
};

let showResult = function(result) {
	let JSONResult = JSON.stringify(result, null, 4);
	Utility.addClass(document.querySelector('.warning'), 'hide');
	document.querySelector('.result').textContent = JSONResult;
};

let showErrorMessage = function() {
	Utility.removeClass(document.querySelector('.warning'), 'hide');
};

let main = function(cities){
	let inputTag = document.querySelector('.tag-input'),
	    submitBtn = document.querySelector('.submit-button'),
	    autoCompleteWrapper = document.querySelector('.auto-complete-wrapper');

	let handleInputKeyDown = function(e){
		addInputInteraction(inputTag, cities, e);
	};
	let handleSubmit = function(e){
		addSubmitInteraction(inputTag, cities, e);
	};

	Utility.addEvent(inputTag, 'keydown', handleInputKeyDown);
	Utility.addEvent(submitBtn, 'click', handleSubmit);
	Utility.addEvent(autoCompleteWrapper, 'click', (e) =>{
		inputTag.focus();
	});
};

Utility.getJSONFrom('../assets/tz.json', sortCityFromRaw, fetchFailedHandler);
