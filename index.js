var path = require('path');
var atomicBuilder = {};
var find = require('findit');
var Promise = require('promise');
var fs = require('fs-extra');
var process_path = process.cwd();
var mkdirp = require('mkdirp');
var extend = require('extend');
var getDirName = path.dirname;

var getFileInfo = function(dir){
  return new Promise(function(resolve,reject){
       var finder = find(dir);
       var files = [];
       finder.on('file',function(path,stat){
            files.push(path);
       });
       finder.on('end',function() {
            resolve(files);
       });
  });
};

var getDoc = function(source,parser){
	var doc = source.match(parser.body);
	if(!doc){
		return "";
	}
	doc = doc[0];
	return doc
		.replace(parser.start,"")
		.replace(parser.end,"");
}

var getMark = function(mark,source){
	var pattern = '@'+mark+'(?:[\t 　]+)(.*)';
	var regex = new RegExp(pattern,"i");
	var match = source.match(regex);
	if(match && match[1]){
		return match[1];
	}else{
		return "";
	}
}




var makeAtomicArray = function(files,markup,styling,parser){
	var components = [];
	var id = 0;
	for(var i = 0,n = files.length; i < n; i++){
		var file = files[i];
		var paths = file.split("/");
		var length = paths.length
		var extName = path.extname(file).replace(".","");
		var baseName = path.basename(file,"."+markup);
		if(extName !== markup){
			continue;
		}
    var html = fs.readFileSync(file,'utf8');
    var css,js,category,name,cssMark;
    var doc = getDoc(html,parser);
    if(!doc){
    	continue;
    }
    name = getMark("name",doc);
    if(!name){
    	continue;
    }
    category = getMark("category",doc) || "atom";
    cssMark = getMark("css",doc);
    if(cssMark){
      var cssPath = path.resolve(file,'../',cssMark);
      try{
      	css = fs.readFileSync(cssPath,'utf8');
      }catch(err){
      	console.log(err);
      }
    }
    var jsMark = getMark("js",doc);
    if(jsMark){
      var jsPath = path.resolve(file,'../',jsMark);
      try{
    		js = fs.readFileSync(jsPath,'utf8');
    	}catch(err){
    		console.log(err);
      }
    }
    id++;
    components.push({category:category,name:name,html:html,css:css,js:js,id:id});
	}
	return components;
}

var writeFile = function(path, contents, cb) {
  mkdirp(getDirName(path), function (err) {
    if (err) return cb(err);

    fs.writeFile(path, contents, cb);
  });
}

atomicBuilder.build = function(opt){
	var src = opt.src;
	var dist = opt.dist;
	var markup = opt.markup;
	var styling = opt.styling;
	var parser = extend({
		start:/<!--@doc/g,
		end:/-->/g,
		body:/<!--@doc(([\n\r\t]|.)*?)-->/g
	},opt.parser);
	return getFileInfo(path.resolve(process_path,src))
	.then(function(files){
		var components = makeAtomicArray(files,markup,styling,parser);
		var json = JSON.stringify({components:components});
		var pjson = new Promise(function(resolve,reject){
			writeFile(path.resolve(process_path,dist),json,function(err){
				console.log(err);
				resolve();
			});
		});
		return pjson;
	});
}

atomicBuilder.init = function(opt){
	var dist = opt.dist;
	var src = opt.src;
	var sample = opt.sample;
	var p1 = new Promise(function(resolve,reject){
		fs.copy(__dirname+"/css",path.resolve(process_path,dist,"./css"),function(err){
			console.log(err);
			resolve();
		});
	});
	var p2 = new Promise(function(resolve,reject){
		fs.copy(__dirname+"/js",path.resolve(process_path,dist,"./js"),function(err){
			resolve();
		});
	});
	var p3 = new Promise(function(resolve,reject){
		fs.copy(__dirname+"/images",path.resolve(process_path,dist,"./images"),function(err){
			resolve();
		});
	});
	var p4 = new Promise(function(resolve,reject){
		fs.copy(__dirname+"/index.html",path.resolve(process_path,dist,"./index.html"),function(err){
			resolve();
		});
	});
	var p5 = new Promise(function(resolve,reject){
		fs.copy(__dirname+"/ace",path.resolve(process_path,dist,"./ace"),function(err){
			resolve();
		});
	});
	var p6 = new Promise(function(resolve,reject){
		fs.copy(__dirname+"/config.js",path.resolve(process_path,dist,"./config.js"),function(err){
			resolve();
		});
	});
	var p7 = new Promise(function(resolve,reject){
		if(sample){
			fs.copy(__dirname+"/components",path.resolve(process_path,src),function(err){
				resolve();
			});
		}else{
			resolve();
		}
	});
	var p8 = new Promise(function(resolve,reject){
		if(sample){
			fs.copy(__dirname+"/resources/setting.json",path.resolve(process_path,dist,"./resources/setting.json"),function(err){
				resolve();
			});
		}else{
			resolve();
		}
	});

	return Promise.all([p1, p2, p3, p4, p5, p6, p7, p8]);
}

module.exports = atomicBuilder;
