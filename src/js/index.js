'use strict';

import Utility from './utility.js';

var a = document.querySelector('h1');
Utility.addClass(a, 'firefox');
Utility.removeClass(a, 'mozilla firefox');

Utility.getJSONFrom('https://api.github.com/users/poasdmzxcjew', function(res){
	console.log(res.login);
},function(err){
	console.log(err);
});