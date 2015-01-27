var url = require('../../url');

exports.javascript = function(element, code, filename) {
	try {
		if (filename && filename.indexOf('file')==0) {
			var f = url.parse(filename);
			var fn = f.protocol + (f.slashes ? '//' : '') + f.pathname;
			load.call(window,fn);
		} else {
			eval.call(window,code);
		}
	} catch(err) {
		err.evalFile = filename;
		throw err;
	}
};
