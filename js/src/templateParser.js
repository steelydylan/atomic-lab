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
	var preview = text.match(/<preview>(([\n\r\t]|.)*?)<\/preview>/g);
	if(!preview){
		return "";
	}
	preview = preview[0];
	return preview.replace(/<(\/)?preview>/g,"");
}


var getTag = function(text,components){
	var ret = text.match(/<(.*?)>/g);
	var result = "";
	if(!ret){
		return "";
	}
	for(var i = 0, length = ret.length; i < length; i++){
		var name = getComponentName(ret[i]);
		components.forEach(function(comp){
			if(name.indexOf(comp.name) !== -1){
				result = ret[i];
			}
		});
		if(result){
			break;
		}
	}
	return result;
}

var getComponentName = function(text){
	return text.replace(/<([a-zA-Z0-9._-]+)\s*\w*.*?>/g,function(comment,name){
		return name;
	});
}

var getTemplate = function(text){
	var template = text.match(/<template(.*?)>(([\n\r\t]|.)*?)<\/template>/g);
	if(!template){
		return "";
	}
	template = template[0];
	return template;
}

var getInnerHtmlFromTemplate = function(template){
	return template.replace(/<(\/)?template(.*?)>/g,"");
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
	var reg = new RegExp("<"+self+"(.*?)>");
	return text.replace(reg,"");
}

var getImports = function(text){
	var match = text.match(/<!-- import="(.*?)" -->/);
	if(!match){
		return "";
	}
	return match[1];
}


module.exports = {
	getTag:getTag,
	getPreview:getPreview,
	getComponentName:getComponentName,
	getVars:getVars,
	getTemplate:getTemplate,
	getInnerHtmlFromTemplate:getInnerHtmlFromTemplate,
	getVarsFromTemplate:getVarsFromTemplate,
	getRendered:getRendered,
	getImports:getImports,
	removeScript:removeScript,
	removeSelf:removeSelf
}
