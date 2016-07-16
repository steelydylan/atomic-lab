jQuery(function($){
	var editor = {};
	var cssLab = new aTemplate.View({
		templates:[
			"css_preview",
			"css_edit",
			"css_search_result",
			"css_search",
			"css_setting",
			"css_new",
			"css_about",
			"css_io",
			"css_cheat"
		],
		data:{
			index:0,
			components:[],
			name:"",
			newName:"",
			css:"",
			html:"",
			newCategory:"",
			category:"",
			search:"",
			about:"",
			editMode:"css",
			searchStatus:"inactive",
			cheatCategory:"",
			cheatAbout:"",
			cheatName:"",
			searchResults:function(){
				var search = this.data.search;
				var components = this.data.components;
				return components.filter(function(comp){
					return comp.name.indexOf(search) >= 0;
				});
			}
		},
		method:{
			initialize:function(){
				this.setData(defs);
				this.loadData("css_lab");
				this.update();
				if(this.data.editMode != "preview" && this.data.editMode != "about"){
					this.applyMethod("runEditor",this.data.editMode);
				}
			},
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
			editComp:function(i){
				var data = this.data;
				var components = this.getComputedProp("searchResults");
				var comp = components[i];
				this.data.css = comp.css;
				this.data.name = comp.name;
				this.data.html = comp.html;
				this.data.category = comp.category;
				this.data.about = comp.about;
				this.data.id = comp.id;
				if(this.data.editMode != "preview" && this.data.editMode != "about"){
					editor.destroy();
				}
				this.update("html","css_search_result");
				this.update("html","css_edit");
				this.update("html","css_preview");
				componentHandler.upgradeDom();
				if(this.data.editMode != "preview" && this.data.editMode != "about"){
					this.applyMethod("runEditor",this.data.editMode);
				}
			},
			deleteComp:function(){
				var id = this.data.id;
				var comps = this.data.components;
				for(var i = 0,n = comps.length; i < n; i++){
					if(comps[i].id == id){
						comps.splice(i,1);
						break;
					}
				}
				this.update("html","css_search_result");
				this.update("html","css_edit");
				this.update("html","css_preview");
				if(this.data.editMode != "preview" && this.data.editMode != "about"){
					this.applyMethod("runEditor",this.data.editMode);
				}
				this.saveData("css_lab");
				componentHandler.upgradeDom();
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
				componentHandler.upgradeDom();
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
			getUniqueId:function(){
				var components = this.data.components;
				var id = this.getRandText(15);
				var flag = false;
				while(1){
					for(var i = 0,n = components.length; i < n; i++){
						if(components[i].id == id){
							flag = true;
						}
					}
					if(flag === false){
						break;
					}
				}
				return id;
			},
			saveComponent:function(e){
				var data = this.data;
				var components = this.data.components;
				var flag = false;
				for(var i = 0,n = components.length; i < n; i++){
					var comp = components[i];
					if(comp.id == data.id){
						comp.html = data.html;
						comp.css = data.css;
						comp.name = data.name;
						comp.id = data.id;
						comp.category = data.category;
						comp.about = data.about;
					}
				}
				this.applyMethod("showAlert","コンポーネントを保存しました。");
				this.update("html","css_search_result");
				componentHandler.upgradeDom();
				this.saveData("css_lab");
			},
			addComponent:function(){
				var data = this.data;
				var id = this.applyMethod("getUniqueId");
				var obj = {html:"",css:"",name:data.newName,id:id,category:data.newCategory};
				var components = this.data.components;
				var flag = false;
				var dialog = document.querySelector(".js-new-dialog");
				this.data.components.push(obj);
				this.data.newName = "";
				this.applyMethod("showAlert","コンポーネントを追加しました。");
				this.update("html","css_search_result");
				componentHandler.upgradeDom();
				this.saveData("css_lab");
				dialog.close();
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
				if(this.data.editMode != "preview" && this.data.editMode != "about"){
					editor.destroy();
				}
			  	this.data.editMode = mode;
				this.update();
				componentHandler.upgradeDom();
				if(this.data.editMode != "preview" && this.data.editMode != "about"){
					this.applyMethod("runEditor",this.data.editMode);
				}
			},
			openCheatDialog:function(i){
				this.e.stopPropagation();
				var components = this.getComputedProp("searchResults");
				var comp = components[i];
				this.data.cheatAbout = comp.about;
				this.data.cheatCategory = comp.category;
				this.data.cheatName = comp.name;
				this.update("html","css_cheat");
				var dialog = document.querySelector(".js-cheat-dialog");
				dialog.showModal();
			},
			closeCheatDialog:function(){
				var dialog = document.querySelector(".js-cheat-dialog");
				dialog.close();
			},
			openDialog:function(){
				var dialog = document.querySelector(".js-new-dialog");
				dialog.showModal();
			},
			closeDialog:function(){
				var dialog = document.querySelector(".js-new-dialog");
				dialog.close();
			},
			openEditDialog:function(){
				var dialog = document.querySelector(".js-edit-dialog");
				dialog.showModal();
			},
			closeEditDialog:function(){
				var dialog = document.querySelector(".js-edit-dialog");
				dialog.close();
			},
			doneEditDialog:function(){
				this.applyMethod("closeEditDialog");
				this.applyMethod("saveComponent");
				this.update("html","css_edit");
			},
			clearEditor:function(){
				this.removeData(['name','html','css']);
				this.saveData("css_lab");
				this.update();
				if(this.data.editMode != "preview"){
					this.applyMethod("runEditor",this.data.editMode);
				}
				componentHandler.upgradeDom();
			},
			isGreaterThan:function(text){
				var cat = this.data.category;
				var category = {
					atom:0,
					molucule:1,
					organism:2,
					template:3
				}
				if(category[cat] > category[text]){
					return true;
				}else{
					return false;
				}
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
						that.applyMethod("saveComponent");
					}
				});
				editor.commands.on("exec",function(e){
					if(e.command && (e.command.name == "reload" || e.command.name == "save")){
						e.preventDefault();
						e.command.exec();
					}
				});
			}
		},
		convert:{
			preview:function(text){
				//textからpreview取得
				var preview = parser.getPreview(text);
				//previewからコメント文取得
				while(1){
					var comment = parser.getComment(preview);
					if(!comment){
						break;
					}
					//commentからコンポーネント名取得
					var name = parser.getComponentName(comment);
					var components = this.data.components;
					var flag = false;
					for(var i = 0,n = components.length; i < n; i++){
						var comp = components[i];
						if(name == comp.name){
							//例えば、atomはmoluculeをincludeできない
							if(this.data.id != comp.id && !this.applyMethod("isGreaterThan",comp.category)){
								break;
							}
							var template = parser.getTemplate(comp.html);
							var html = parser.getInnerHtmlFromTemplate(template);
							var defs = parser.getVarsFromTemplate(template);
							var overrides = parser.getVars(comment);
							html = parser.getRendered(html,defs,overrides);
							preview = preview.replace(comment,html);
							preview += "<style>"+comp.css+"</style>"
							break;
						}
					}
					preview = preview.replace(comment,"");
				}
				//todo delete
				return parser.removeScript(preview);
			},
			deleteScriptTag:function(data){
				return parser.removeScript(data);
			},
			markdown:function(data){
				return marked(data);
			}
		}
	}).applyMethod("initialize");
});
