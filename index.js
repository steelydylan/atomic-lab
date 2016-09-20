var path = require('path');
var atomicBuilder = {};
var find = require('findit');
var Promise = require('promise');
var fs = require('fs');
var process_path = process.cwd();
var mkdirp = require('mkdirp');
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

var getDoc = function(source){
	var doc = source.match(/<!--@doc(([\n\r\t]|.)*?)-->/g);
	if(!doc){
		return "";
	}
	doc = doc[0];
	return doc
		.replace(/<!--@doc/g,"")
		.replace(/-->/g,"");
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




var makeAtomicArray = function(files,markup,styling){
	var components = [];
	var id = 0;
	for(var i = 0,n = files.length; i < n; i++){
		var file = files[i];
		var paths = file.split("/");
		var length = paths.length
		var extName = path.extname(file).replace(".","");
		var baseName = path.basename(file,"."+markup);
		if(extName === markup){
      var html = fs.readFileSync(file,'utf8');
      var css,js,category,name;
      var doc = getDoc(html);
      if(doc){
	      category = getMark("category",doc) || "atom";
	      name = getMark("name",doc) || "baseName";
	      var cssMark = getMark("css",doc);
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
	    }
      id++;
      components.push({category:category,name:name,html:html,css:css,js:js,id:id});
		}
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
	return getFileInfo(path.resolve(process_path,src))
	.then(function(files){
		var components = makeAtomicArray(files,markup,styling);
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

module.exports = atomicBuilder;
