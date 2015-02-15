var url = require('../../url');

exports.javascript = function(element, code, filename) {
	try {
		if (filename) {
			var q = filename.indexOf('?');
			if (q != -1) filename = filename.substring(0,q);
			load.call(window,String(filename).replace(/^classpath:/,""));
		} else {
			eval.call(window,code);
		}
	} catch(err) {
		err.evalFile = filename;
		throw err;
	}
};
