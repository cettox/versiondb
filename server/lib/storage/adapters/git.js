var config = require(__dirname+"/../../../config/config.js").config;
var fs = require('fs');
var exec = require('child_process').exec
/*
	git storage adapter, should implement following functions
	

	storeRevision(data,callback); passes revision id to callback after completion (for git it is commit id)
	getRevision(revId,callback); goes to given revision id, passes data to callback function,
	getRevisions(length,callback); returns latest revisions from the last one, length number of revisions. if Lenght is 0, returns all revisions
	getDif(revId,callback); passes diff of given revId from previous revision

	init(collectionName,callback); //inits git adapter with given collectionName, if no git repo found, then firstly inits the repo, and data.json file with empty json file

*/


	function gitAdapter(){

		var self = this;
		var root = config.gitLoc;
		var repoName = "";
		/*
			interfaceFunctions
		*/ 
		self.init = function(collectionName,callback){
			repoName = collectionName;
			//check for directory exists TODO: make dirName dynamic so that sharding could be applied
			var dirName = root+"/"+collectionName;
			console.log("Dir Name ",dirName);
			dir_exists(dirName,function(res){
				if(!res){
					create_dir(dirName,function(){
						nextStep();
					})
				}else{
					nextStep();
				}
			});


			var nextStep = function(){
				is_git_repo(dirName,function(res){
					if(!res){
						init_git_repo(dirName,function(){
							callback();
						})
					}else{
						callback();
					}
				});
			}
		}

		self.storeRevision = function(data,callback){
			var dirName = root+"/"+repoName;
			var fileName = dirName +"/data.json";
			write_to_file(fileName,JSON.stringify(data,null,4),function(){
				console.log("file written ",fileName);
				nextStep();
			});

			var nextStep = function(){
				commit_git_repo(dirName,function(){
					callback();
				})
			}

		}


		/*
			privateFunctions
		*/
		var dir_exists = function(dirName,callback){
			fs.exists(dirName,callback);
		}

		var is_git_repo = function(dirName,callback){
			fs.exists(dirName + "/.git/",callback);
		}

		var create_dir = function(dirName,callback){
			exec("mkdir "+dirName,function(error,stdout,stderr){
			    if (error !== null) {
			      console.log('exec error: ' + error);
			    }else{
			    	callback();
			    }
			});
		}

		var init_git_repo = function(dirName,callback){
			exec("git init -q "+dirName,function(error,stdout,stderr){
			    if (error !== null) {
			      console.log('exec error: ' + error);
			    }else{
			    	callback();
			    }
			});
		}

		var commit_git_repo = function(dirName,callback){
			console.log("executing git command ","git add . "+dirName);
			exec("git add . ",{cwd:dirName},function(error,stdout,stderr){
			    if (error !== null) {
			      console.log('exec error: 1' + error);
			    }else{
			    	console.log("executing git command ","git commit -m \"ccc\" "+dirName);
			    	exec("git commit -m \"ccc\" ",{cwd:dirName},function(error,stdout,stderr){
					    if (error !== null) {
					      console.log('exec error: 2' + error);
					    }else{
					    	callback();
					    }
					});
			    }
			});
		}

		var write_to_file = function(fileName,data,callback){
			fs.writeFile(fileName, data, function(err) {
			    if(err) {
			        console.log("error occured while writing to file ",fileName);
			    } else {
			        callback();
			    }
			}); 
		}
	}

	module.exports = gitAdapter;


