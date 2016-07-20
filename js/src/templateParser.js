var getVars = function(text){
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

var getPreview = function(text){
	var preview = text.match(/<!-- preview -->(([\n\r\t]|.)*?)<!-- \/preview -->/g);
	if(!preview){
		return "";
	}
	preview = preview[0];
	return preview.replace(/<!-- (\/)?preview -->/g,"");
}


var getComment = function(text){
	var ret = text.match(/<!--(.*?)-->/g);
	if(ret){
		return ret[0];
	}else{
		return "";
	}
}

var getComponentName = function(text){
	return text.replace(/<!-- (\w+) (.*?)-->/g,function(comment,name){
		return name;
	});
}

var getTemplate = function(text){
	var template = text.match(/<!-- template(.*?)-->(([\n\r\t]|.)*?)<!-- \/template -->/g);
	if(!template){
		return "";
	}
	template = template[0];
	return template;
}

var getInnerHtmlFromTemplate = function(template){
	return template.replace(/<!-- (\/)?template(.*?) -->/g,"");
}

var getVarsFromTemplate = function(template){
	var templateInside = getInnerHtmlFromTemplate(template);
	var templateFirst = template.replace(templateInside,"").replace("<!-- /template -->","");
	return getVars(templateFirst);
}

var getRendered = function(template,defs,overrides){
	var vars = $.extend({},defs,overrides);
	return template.replace(/{(.*?)}/g,function(a,b){
		return vars[b] || "";
	});
}

var removeScript = function(text){
	return text.replace(/<script([^'"]|"(\\.|[^"\\])*"|'(\\.|[^'\\])*')*?<\/script>/g,"");
}

var removeSelf = function(text,self){
	var reg = new RegExp("<!-- "+self+"(.*?)-->");
	return text.replace(reg,"");
}


module.exports = {
	getComment:getComment,
	getPreview:getPreview,
	getComponentName:getComponentName,
	getVars:getVars,
	getTemplate:getTemplate,
	getInnerHtmlFromTemplate:getInnerHtmlFromTemplate,
	getVarsFromTemplate:getVarsFromTemplate,
	getRendered:getRendered,
	removeScript:removeScript,
	removeSelf:removeSelf
}
