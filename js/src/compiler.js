var ejs = require("ejs");
var jade = require("jade");
var haml = require("hamljs");
module.exports = {
	styling:{
		sass:function(txt){
			return Sass.compile(txt);
		},
		less:function(txt){
			var source = '';
    	less.Parser().parse(txt, function(err, tree) {
	      if (err) {
	        return console.error(err);
	      }
	      source = tree.toCSS();
    	});
    	return source;
		},
		stylus:function(txt){
			var source = '';
	    var renderer = stylus(txt);
	    renderer.render(function(a, b) {
	      source = b;
	    });
			return source;
		},
		css:function(txt){
			return txt;
		}
	},
	markup:{
		html:function(txt){
			return txt;
		},
		ejs:function(txt){
			try{
				return ejs.render(txt);
			}catch(err){
				return txt;
			}
		},
		jade:function(txt){
			try{
				return jade.render(txt);
			}catch(err){
				return txt;
			}
		},
		haml:function(txt){
			try{
				console.log("test");
				console.log(haml.render(txt));
				return haml.render(txt);
			}catch(err){
				return txt;
			}
		}
	}
}
