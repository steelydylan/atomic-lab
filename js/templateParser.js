(function(global){

	var getVarsFromText = function(text){
		var vars = text.match(/(\w+)="(.*?)"/g);
		var defs = {};
		if(!vars){
			return defs;
		}
		vars.forEach(function(item){
			var key = item.replace(/=.*/,"");
			var value = item.replace(/.*=/,"").replace(/"/g,"");
			defs[key] = value;
		});
		return defs;
	}


	var parseTemplate = function(text,name){
		var preview = text.match(/<!-- preview -->(([\n\r\t]|.)*?)<!-- \/preview -->/g);
		if(!preview){
			return "";
		}
		preview = preview[0];
		preview = preview.replace(/<!-- (\/)?preview -->/g,"");

		var template = text.match(/<!-- template(.*?)-->(([\n\r\t]|.)*?)<!-- \/template -->/g);
		if(!template){
			return "";
		}
		template = template[0];

		//template inside
		var templateInside = template.replace(/<!-- (\/)?template(.*?) -->/g,"");
		var templateFirst = template.replace(templateInside,"").replace("<!-- /template -->","");
		//default vars
		var defs = getVarsFromText(templateFirst);
		var reg = new RegExp("<!-- "+name+"(.*?)-->","g");
		preview = preview.replace(reg,function(a,b,c){
			var vars = $.extend({},defs,getVarsFromText(a));
			return templateInside.replace(/{(.*?)}/g,function(a,b){
				return vars[b] || "";
			});
		});
		return preview;
	};

	global.parseTemplate = parseTemplate;
})(window);
