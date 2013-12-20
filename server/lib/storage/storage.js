
var gitAdapter = require(__dirname+"/adapters/git.js");

module.exports = {
	storage : new gitAdapter()
};

