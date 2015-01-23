exports.readFile = function(file, enc, callback) {
  try {
    text = readFile(file, enc);
	callback(null, text);
  }
  catch (e) {
    callback(e, null);
  }
}