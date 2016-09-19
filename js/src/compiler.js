var ejs = require("ejs");
var jade = require("jade");
var haml = require("hamljs");
var css = require("css");
var normalize = require("./normalize.js");
module.exports = {
	util:{
		addNormalizeCss:function(){
			return normalize;
		},
		addParentSelectorToAll:function(source,addClass){
			var parse = css.parse(source);
			var rules = parse.stylesheet.rules;
			if(!rules){
				return source;
			}
			for(var i = 0,n = rules.length; i < n; i++){
				var rule = rules[i];
				var selectors = rule.selectors;
				if(!selectors){
					continue;
				}
				for(var j= 0, m = selectors.length; j < m; j++){
					if(selectors[j] === "body" || selectors[j] === "html"){
						selectors[j] = addClass;
					}else{
						selectors[j] = addClass+" "+selectors[j];
					}
				}
			}
			source = css.stringify(parse);
			return source;
		}
	},
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
				console.log(haml.render(txt));
				return haml.render(txt);
			}catch(err){
				return txt;
			}
		}
	}
}
