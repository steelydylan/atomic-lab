var conf;
var init = function(data){
	conf = data;
}
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
	if(!text){
		return "";
	}
	var preview = text.match(conf.preview.body);
	if(!preview){
		return "";
	}
	preview = preview[0];
	return preview
		.replace(conf.preview.start,"")
		.replace(conf.preview.end,"");
}

var getNote = function(text){
	if(!text){
		return "";
	}
	var note = text.match(conf.note.body);
	if(!note){
		return "";
	}
	note = note[0];
	return note
		.replace(conf.note.start,"")
		.replace(conf.note.end,"");
}

var getTag = function(text,components){
	if(!text){
		return "";
	}
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
	if(!text){
		return "";
	}
	return text.replace(/<([a-zA-Z0-9._-]+)\s*\w*.*?>/g,function(comment,name){
		return name;
	});
}

var getTemplate = function(text){
	if(!text){
		return "";
	}
	var template = text.match(conf.template.body);
	if(!template){
		return "";
	}
	template = template[0];
	return template;
}

var getInnerHtmlFromTemplate = function(template){
	return template
		.replace(conf.template.start,"")
		.replace(conf.template.end,"");
}

var getVarsFromTemplate = function(template){
	var templateInside = getInnerHtmlFromTemplate(template);
	var templateFirst = template.replace(templateInside,"").replace(conf.template.end,"");
	return getVars(templateFirst);
}

var getRendered = function(template,defs,overrides){
	var vars = $.extend({},defs,overrides);
	return template.replace(conf.variable.mark,function(a,b){
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
	var match = text.match(conf.import.body);
	if(!match){
		return "";
	}
	return match[1];
}


module.exports = {
	init:init,
	getTag:getTag,
	getPreview:getPreview,
	getNote:getNote,
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
