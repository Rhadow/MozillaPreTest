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
	}
};

export default Utility;