'use strict';

var Utility = {
	addClass(dom, classNames='') {
		let allClassNames = dom.className.split(' ').concat(classNames.split(' ')),
		    finalClassNames = [];

		allClassNames.forEach(name => {
			if(finalClassNames.indexOf(name) < 0){
			    finalClassNames.push(name);
			}
		});

		dom.className = finalClassNames.join(' ');
	},
	removeClass(dom, classNames='') {
		let originalClassNames = dom.className.split(' '),
		    classNamesToDelete = classNames.split(' '),
		    newClassNames;

		newClassNames = originalClassNames.filter(originalName => {
			return classNamesToDelete.every((deleteName) => {
				return originalName !== deleteName;
			});
		}).join(' ');

		dom.className = newClassNames;
	},
	hasClass(dom, className='') {
		return dom.className.split(' ').indexOf(className) >= 0;
	},
	getJSONFrom(src, success=function(){}, failure=function(){}){
		var xhr = new XMLHttpRequest();
		xhr.open('get', src);
	    xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
	        if (xhr.status === 200) {
		        success(JSON.parse(xhr.response));
		    }
		    else {
		    	failure(JSON.parse(xhr.response));
		    }
		};
		xhr.send();
	},
	addEvent(dom, event, handler) {
		if (typeof dom.addEventListener !== "undefined") {
		  dom.addEventListener(event,handler,false);
		} else {
		  dom.attachEvent(`on${event}`, handler)
		}
	},
	createListElement (content) {
		let node = document.createElement('li'),
		    text = document.createTextNode(content);
		node.appendChild(text);
		return node;
	},
	createTagElement (content) {
		let node = document.createElement('span'),
		    text = document.createTextNode(content),
			cancelNode = document.createElement('span'),
			cancelText = document.createTextNode('x');
		cancelNode.appendChild(cancelText);
		node.className = 'tag';
		cancelNode.className = 'remove';
		node.appendChild(text);
		node.appendChild(cancelNode);
		return node;
	},
	removeAllChildNodes (dom) {
		while (dom.firstChild) {
		    dom.removeChild(dom.firstChild);
		}
	}
};

export default Utility;
