var connect = require('connect'),
    http = require('http'),
 	config = require(__dirname+'/config/config.js'),
 	aaa = require(__dirname+'/lib/storage/storage.js');
var app = connect()
    .use(function(req, res, next) {
    	var storage = aaa.storage;
    	storage.init("myform",function(){
    		console.log("repo created");
    		storage.storeRevision({revisionNumber:1},function(){
    			console.log("revision committed");
    		});
    	});
        res.end("hello world");


    });
 
http.createServer(app).listen(3000);