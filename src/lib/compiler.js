module.exports = {
	styling:{
		scss:function(txt) {
			return Sass.compile(txt);
		},
		sass:function(txt){
			return Sass.compile(txt);
		},
		less:function(txt){
			let source = '';
    	less.Parser().parse(txt, function(err, tree) {
	      if (err) {
	        return console.error(err);
	      }
	      source = tree.toCSS();
    	});
    	return source;
		},
		stylus:function(txt){
			let source = '';
	    const renderer = stylus(txt);
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
				return haml.render(txt);
			}catch(err){
				return txt;
			}
		}
	}
}