(function($){
	$(function(){
		$(document).on("click",function(){
			if($(".cssLabHeaderSearchArea:hover").length == 0){
				cssLab.data.searchStatus = "inactive";
				cssLab.update("html","css_search_result");
				cssLab.saveData("css_lab");
			}
		});
		var editor = {};
		var cssLab = new aTemplate.View({
        	templates:[
        		"css_preview",
        		"css_edit",
        		"css_search_result",
        		"css_search",
        		"css_setting"
        	],
        	data:{
        		index:0,
        		components:[],
        		name:"",
        		css:"",
        		html:"",
        		search:"",
            editMode:"css",
        		searchStatus:"inactive",
        		searchResults:function(){
        			var search = this.data.search;
        			var components = this.data.components;
        			return components.filter(function(comp){
        				return comp.name.indexOf(search) >= 0;
        			});
        		}
        	},
        	method:{
        		showAlert:function(msg){
        			var $alert = $("<div class='sourceCopied'>"+msg+"</div>");
              $("body").append($alert);
              $alert.delay(1).queue(function(next){
                  $(this).addClass("active");
                  next();
              }).delay(700).queue(function(next){
                  $(this).removeClass('active');
                  next();
              }).delay(200).queue(function(next){
                  $(this).remove();
                  next();
              });
        		},
        		changeStyle:function(target){
        			this.update("html","css_preview");
        			this.saveData("css_lab");
        		},
        		insertCompToHtml:function(i){
        			var data = this.data;
        			var components = this.getComputedProp("searchResults");
        			var html = this.data.html;
        			this.data.html = html +"<$" +components[i].name+">";
        			editor.destroy();
        			this.update("html","css_preview");
        			this.update("html","css_edit");
        			this.saveData("css_lab");
        			this.applyMethod("runEditor",this.data.editMode);
        		},
        		editComp:function(i){
        			var data = this.data;
        			var components = this.getComputedProp("searchResults");
        			var comp = components[i];
        			this.data.css = comp.css;
        			this.data.name = comp.name;
        			this.data.html = comp.html;
        			editor.destroy();
        			this.update("html","css_search_result");
        			this.update("html","css_edit");
        			this.update("html","css_preview");
        			this.applyMethod("runEditor",this.data.editMode);
        		},
        		deleteComp:function(i){
        			var data = this.data;
        			var components = this.getComputedProp("searchResults");
        			var comp = components[i];
        			var name = comp.name;
        			var comps = this.data.components;
        			for(var i = 0,n = comps.length; i < n; i++){
        				if(comps[i].name == name){
        					comps.splice(i,1);
        					break;
        				}
        			}
        			this.update("html","css_search_result");
        			this.update("html","css_edit");
        			this.update("html","css_preview");
        		},
        		outputComp:function(){
        			var zip = new JSZip();
        			zip.file("setting.json", JSON.stringify(this.data));
        			var content = zip.generate({type:"blob"});
              saveAs(content, "css-lab.zip");
        		},
        		searchComponents:function(){
        			this.data.searchStatus = "active";
        			this.update("html","css_search_result");
        		},
        		convertCompToHtml:function(word){
        			var data = this.data.components;
        			var html = "";
        			for(var i = 0,n = data.length; i < n; i++){
        				if(data[i].name == word){
        					html = "<style>"+data[i].css+"</style>"+data[i].html;
        				}
        			}
        			return html;
        		},
        		addComponent:function(){
        			var data = this.data;
        			var obj = {html:data.html,css:data.css,name:data.name};
        			var components = this.data.components;
        			var flag = false;
        			for(var i = 0,n = components.length; i < n; i++){
        				if(components[i].name == obj.name){
        					components[i] = obj;
        					flag = true;
        					break;
        				}
        			}
        			if(!flag){
        				this.data.components.push(obj);
        				this.applyMethod("showAlert","コンポーネントを追加しました!!");
        			}else{
        				this.applyMethod("showAlert","コンポーネントを保存しました!!");
        			}
        			this.update("html","css_search_result");
        			this.saveData("css_lab");
        		},
        		readSetting:function(){
        			var evt = this.e;
        			var files = evt.target.files;
        			var that = this;
        			for (var i = 0, f; f = files[i]; i++) {
        				var reader = new FileReader();
        				reader.onload = (function(theFile) {
        					var json = theFile.target.result.replace("data:application/json;base64,","");
        					json = atob(json);
        					json = JSON.parse(json);
        					that.setData(json);
        					that.update();
        				});
        				reader.readAsDataURL(f);
        			}
        		},
            changeMode:function(mode){
              this.data.editMode = mode;
           		editor.destroy();
            	this.update();
            	this.applyMethod("runEditor",this.data.editMode);
            },
            clearEditor:function(){
            	this.removeData(['name','html','css']);
            	this.saveData("css_lab");
            	this.update();
            },
            runEditor:function(name){
            	var that = this;
							editor = ace.edit("js-"+name);
							editor.setTheme("ace/theme/monokai");
							editor.getSession().setMode("ace/mode/"+name);
							editor.setOptions({
								enableBasicAutocompletion: true,
								enableSnippets: true,
								enableLiveAutocompletion: true
							});
							editor.commands.addCommand({
								name:"reload",
								bindKey:{win:"Ctrl+R",mac:"Command-R"},
								exec: function(){

								},
							});
							editor.commands.addCommand({
								name:"save",
								bindKey:{win:"Ctrl+S",mac:"Command-S"},
								exec: function(){
									that.data[name] = editor.getSession().getValue();
									that.update("html","css_preview");
								}
							})
							editor.commands.on("exec",function(e){
								if(e.command && (e.command.name == "reload" || e.command.name == "save")){
									e.preventDefault();
									e.command.exec();
								}
							});
            }
        	},
        	convert:{
        		applyShortCord:function(data){
        			var that = this;
        			while(data.match(/\<\$(\w+)\>/)){
	        			data = data.replace(/\<\$(\w+)\>/g,function(i,word){
	        				return that.applyMethod("convertCompToHtml",word);
	        			});
	        		}
        			return data;
        		}
        	}
        });
		cssLab.setData(defs);
		cssLab.loadData("css_lab");
    cssLab.update();
    cssLab.applyMethod("runEditor",cssLab.data.editMode);
	});
})(jQuery);
