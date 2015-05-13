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
	getJSONFrom(src){
		let promise = new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open('get', src);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function() {
			    if (xhr.status === 200) {
			    	resolve(JSON.parse(xhr.response));
			    }
			    else {
			    	reject(JSON.parse(xhr.status));
			    }
			};
			xhr.send();
		});
		return promise;
	}
};

export default Utility;