jQuery(function($) {
	var dialogPolyfill = require("./dialog-polyfill.js");
	var aTemplate = require("./aTemplate.js");
	var saveAs = require("./fileSaver.min.js").saveAs;
	var JSZip = require("./jszip.min.js");
	var urlParser = require("url");
	require("./jszip-deflate.js")(JSZip);
	require("./jszip-inflate.js")(JSZip);
	var marked = require("./marked.js");
	var compiler = require("./compiler.js");
	var slackWidget = require("./slack-widget.js");
	var Prism = require("./prism.js");
	var editor = {};
	var i18n = jQuery.i18n.browserLang();
	var lang;
	var storageName = "atomic-lab";
	var parser = require("./templateParser.js");
	parser.init(config.parser);
	if (i18n == 'ja') {
		lang = "ja";
	} else {
		lang = "en";
	}
	var material = {
		atom: 0,
		molecule: 1,
		organism: 2,
		template: 3
	};
	var atomicLab = new aTemplate.View({
		templates: [
			"css_preview",
			"css_edit",
			"css_search_result",
			"css_search",
			"css_setting",
			"css_new",
			"css_about",
			"css_io",
			"css_cheat",
			"css_remove",
			"css_exp",
			"css_collections",
			"css_project",
			"css_fab",
			"css_dependencies",
			"css_template"
		],
		data: {
			lang: lang,
			components: [],
			collections: [],
			projectName: "project1",
			name: "",
			newName: "",
			css: "",
			html: "",
			newCategory: "atom",
			category: "",
			about: "",
			editMode: "preview",
			markup: "ejs",
			styling: "sass",
			search: "",
			searchCategory: {
				atom:true,
				molecule:true,
				organism:true,
				template:true
			},
			searchStatus: "inactive",
			cheatCategory: "",
			cheatAbout: "",
			cheatName: "",
			fabState: "is-closed",
			projectOnDrop: "false",
			atomSearchResults: function() {
				return this.applyMethod("getSearchResults", "atom");
			},
			moleculeSearchResults: function() {
				return this.applyMethod("getSearchResults", "molecule");
			},
			organismSearchResults: function() {
				return this.applyMethod("getSearchResults", "organism");
			},
			templateSearchResults: function() {
				return this.applyMethod("getSearchResults", "template");
			},
			sortByCategory: function(){
				var components = this.data.components;
				return components.sort(function(a,b){
					if(material[a.category] >= material[b.category]){
						return 1;
					}else{
						return -1;
					}
				})
			},
			collectionsReverse: function() {
				return this.data.collections.slice().reverse();
			},
			hasPreview: function(){
				return parser.getPreview(this.data.html);
			},
			hasNote: function(){
				return parser.getNote(this.data.html);
			}
		},
		method: {
			initialize: function() {
				var self = this;
				var query = urlParser.parse(location.href, true).query;
				this.loadData(storageName);
				this.data.use_url_shortener = config.use_url_shortener;
				this.data.title = config.title;
				this.data.css_dependencies = config.css_dependencies;
				this.data.markup = config.markup;
				this.data.styling = config.styling;
					//ハッシュタグがあればハッシュタグからデータを復元
				if (location.hash) {
					var zip = new JSZip();
					var hash = location.hash
					try{
						var strings = JSZip.base64.decode(hash);
						strings = JSZip.compressions.DEFLATE.uncompress(strings);
						strings = decodeURI(strings);
						var data = JSON.parse(strings);
						this.data.components = data.components;
						this.data.styling = data.styling;
						this.data.markup = data.markup;
						this.data.projectName = data.projectName;
						this.data.projectDescription = data.projectDescription;
						location.hash = "";
					}catch(err){
						console.log(err);
					}
					this.applyMethod("applyData");
					//json_enable=trueならローカルフォルダのproject.jsonからデータを復元
				} else if (config.read_from_local_file) {
					$.getJSON(config.local_file_path)
						.success(function(data) {
							self.setData(data);
							self.applyMethod("applyData");
						}).error(function(err) {
							console.log(err);
							self.applyMethod("applyData");
						});
				} else {
					this.applyMethod("applyData");
				}
				return this;
			},
			applyData: function() {
				var comp = this.applyMethod("getCompById",this.data.id) || this.data.components[0];
				if (comp) {
					this.setData({
						id:comp.id,
						html:comp.html,
						css:comp.css,
						category:comp.category,
						name:comp.name,
						projectOnDrop: "false",
						searchCategory: {
							atom:true,
							molecule:true,
							organism:true,
							template:true
						}
					});
				}
				this.update();
				return this;
			},
			getSearchResults: function(category) {
				var search = this.data.search;
				var components = this.data.components;
				var searchCategory = this.data.searchCategory;
				return components
					.sort(function(a, b) {
						if (a.name > b.name) {
							return 1;
						} else {
							return -1;
						}
					})
					.filter(function(comp) {
						if (comp.category !== category) {
							return false;
						}
						return comp.name.indexOf(search) >= 0;
					});
			},
			getShortenedUrl: function() {
				var d = new $.Deferred();
				var that = this;
				var zip = new JSZip();
				var data = this.data;
				var strings = JSON.stringify(data);
				var hash = encodeURI(strings);
				hash = JSZip.compressions.DEFLATE.compress(hash);
				hash = JSZip.base64.encode(hash);
				var key = config.key;
				location.hash = hash;
				var url = location.href;
				var obj = urlParser.parse(url);
				//remove query
				obj.search = obj.query = "";
				url = urlParser.format(obj);
				location.hash = "";
				$.ajax({
					url: "https://www.googleapis.com/urlshortener/v1/url?key=" + key,
					type: "POST",
					contentType: "application/json; charset=utf-8",
					data: JSON.stringify({
						longUrl: url,
					}),
					dataType: "json",
					success: function(res) {
						that.data.shortenedUrl = res.id;
						d.resolve();
					},
				})
				return d.promise();
			},
			//after updated
			onUpdated: function() {
				this.saveData(storageName);
				componentHandler.upgradeDom();
				if (this.data.editMode != "preview") {
					this.applyMethod("runEditor", this.data.editMode);
				}
				$(".js-note code").each(function(){
					Prism.highlightElement($(this)[0]);
				});
			},
			showAlert: function(msg) {
				var $alert = $("<div class='sourceCopied'>" + msg + "</div>");
				$(".mdl-dialog").addClass("mdl-dialog--fade");
				$("body").append($alert);
				$alert.delay(1).queue(function(next) {
					$(this).addClass("active");
					next();
				}).delay(700).queue(function(next) {
					$(this).removeClass('active');
					next();
				}).delay(200).queue(function(next) {
					$(this).remove();
					$(".mdl-dialog").removeClass("mdl-dialog--fade");
					next();
				});
			},
			changeStyle: function(target) {
				this.update("html", "css_preview");
				this.saveData(storageName);
			},
			getCompById:function(id){
				var data = this.data;
				var components = data.components;
				var comp;
				for (var i = 0, n = components.length; i < n; i++) {
					if (components[i].id == id) {
						comp = components[i];
					}
				}
				return comp;
			},
			copyToClipBoard:function(msg){
				var copyArea = $("<textarea/>");
				$("body").append(copyArea);
				copyArea.text(msg);
				copyArea.select();
				document.execCommand("copy");
				copyArea.remove();
				return this;
			},
			copySnippet: function(id){
				var comp = this.applyMethod("getCompById",id);
				this.e.stopPropagation();
				this.applyMethod("showAlert","Snippet successfully copied");
				var snippet = parser.getTemplate(comp.html);
				var inner = parser.getInnerHtmlFromTemplate(snippet);
				snippet = snippet.replace(inner,"");
				snippet = snippet.replace(/template/g,comp.name);
				snippet = snippet.replace(/<!--@/g,"<");
				snippet = snippet.replace(/-->/g,">");
				this.applyMethod("copyToClipBoard",snippet);
			},
			editComp: function(id) {
				var comp = this.applyMethod("getCompById",id);
				this.data.css = comp.css;
				this.data.name = comp.name;
				this.data.html = comp.html;
				this.data.category = comp.category;
				this.data.id = comp.id;
				if (this.data.editMode != "preview") {
					editor.destroy();
				}
				this.update("html", "css_search_result");
				this.update("html", "css_edit");
				this.update("html", "css_preview");
			},
			deleteComp: function() {
				var id = this.data.id;
				var comps = this.data.components;
				for (var i = 0, n = comps.length; i < n; i++) {
					if (comps[i].id == id) {
						comps.splice(i, 1);
						break;
					}
				}
				if(comps[0]){
					var id = comps[0].id;
					this.applyMethod("editComp",id);
				}else{
					this.removeData(["html", "css", "name", "category"]);
				}
				this.update("html", "css_search_result");
				this.update("html", "css_edit");
				this.update("html", "css_preview");
				this.saveData(storageName);
			},
			outputComp: function() {
				var zip = new JSZip();
				var comps = this.data.components;
				var that = this;
				zip.file("setting.json", JSON.stringify({
					components: comps
				}));
				comps.forEach(function(comp) {
					var file1 = "components/" + comp.category + "/" + comp.name + "/" + comp.name + "." + that.data.markup;
					var file2 = "components/" + comp.category + "/" + comp.name + "/" + comp.name + "." + that.data.styling;
					zip.file(file1, comp.html);
					zip.file(file2, comp.css);
				});
				zip.file("package.json", this.getHtml("#package_json"));
				zip.file("gulpfile.js", this.getHtml("#gulpfile_js"));
				var content = zip.generate({
					type: "blob"
				});
				saveAs(content, "atomic-lab.zip");
			},
			searchComponents: function() {
				this.data.searchStatus = "active";
				this.update("html", "css_search_result");
			},
			toggleComponents: function(target,category){
				var self = this.e.target;
				var searchCategory = this.data.searchCategory;
				var $target = $(target);
				var status = searchCategory[category];
				if(status === true){
					$("i",self).text("keyboard_arrow_down");
					$(self).parents(".js-list-parent").addClass("js-closed");
					searchCategory[category] = false;
					$target.animate({"height": "0px"}, 120);
				}else{
					$("i",self).text("keyboard_arrow_up");
					$(self).parents(".js-list-parent").removeClass("js-closed");
					searchCategory[category] = true;
					$target.css({"height": ""});
				}
			},
			toggleProjectList: function(){
				var $dropdown = $(".js-dropdown");
				console.log(this.data.projectOnDrop);
				if(this.data.projectOnDrop === "false"){
					this.data.projectOnDrop = "true";
					$dropdown.addClass("js-open");
					$dropdown.css({
						"transform": "scale(1)",
						"opacity": 1
					});
					$("#mask-dropdown-cancel").show();
				}else{
					this.data.projectOnDrop = "false";
					$dropdown.removeClass("js-open");
					$dropdown.css({
						"transform": "scale(0)",
						"opacity": 0
					});
					$("#mask-dropdown-cancel").hide();
				}
			},
			makeNewProject: function(){
				this.setData({
					components:[],
					projectName:"New Project",
					projectDescription:"",
					html:"",
					css:"",
					name:"",
					projectOnDrop:"false"
				});
				this.update();
			},
			convertCompToHtml: function(word) {
				var data = this.data.components;
				var html = "";
				for (var i = 0, n = data.length; i < n; i++) {
					if (data[i].name == word) {
						html = "<style>" + data[i].css + "</style>" + data[i].html;
					}
				}
				return html;
			},
			getUniqueId: function() {
				var components = this.data.components;
				var id = this.getRandText(15);
				var flag = false;
				while (1) {
					for (var i = 0, n = components.length; i < n; i++) {
						if (components[i].id == id) {
							flag = true;
						}
					}
					if (flag === false) {
						break;
					}
				}
				return id;
			},
			saveComponent: function(e) {
				var data = this.data;
				var components = this.data.components;
				var flag = false;
				for (var i = 0, n = components.length; i < n; i++) {
					var comp = components[i];
					if (comp.id == data.id) {
						comp.html = data.html;
						comp.css = data.css;
						comp.name = data.name;
						comp.id = data.id;
						comp.category = data.category;
					}
				}
				this.applyMethod("showAlert", "コンポーネントを保存しました。");
				this.update("html", "css_search_result");
				// this.update("html", "css_edit");
				this.update("html", "css_preview");
				this.saveData(storageName);
			},
			addComponent: function() {
				var data = this.data;
				var id = this.applyMethod("getUniqueId");
				var html = this.getHtml("#css_template");
				var obj = {
					html: html,
					css: "",
					name: data.newName,
					id: id,
					category: data.newCategory
				};
				var components = this.data.components;
				var dialog = document.querySelector(".js-new-dialog");
				dialog.close();
				this.data.components.push(obj);
				this.data.newName = "";
				this.applyMethod("editComp",id);
				this.applyMethod("showAlert", "コンポーネントを追加しました。");
				this.update("html", "css_search_result");
				this.update("html", "css_edit");
				this.update("html", "css_preview");
				this.saveData(storageName);
			},
			readSetting: function() {
				var evt = this.e;
				var files = evt.target.files;
				var that = this;
				for (var i = 0, f; f = files[i]; i++) {
					var reader = new FileReader();
					reader.onload = (function(theFile) {
						var json = theFile.target.result.replace("data:application/json;base64,", "");
						json = atob(json);
						json = JSON.parse(json);
						that.setData(json);
						that.update();
					});
					reader.readAsDataURL(f);
				}
			},
			changeMode: function(mode) {
				if (this.data.editMode !== "preview") {
					editor.destroy();
				}
				this.data.editMode = mode;
				this.update();
			},
			openCheatDialog: function(i) {
				this.e.stopPropagation();
				var components = this.getComputedProp("searchResults");
				var comp = components[i];
				this.data.cheatCategory = comp.category;
				this.data.cheatName = comp.name;
				this.update("html", "css_cheat");
				var dialog = document.querySelector(".js-cheat-dialog");
				dialogPolyfill.registerDialog(dialog);
				dialog.showModal();
			},
			closeCheatDialog: function() {
				var dialog = document.querySelector(".js-cheat-dialog");
				dialog.close();
			},
			openDialog: function(category) {
				this.data.newCategory = category;
				this.update("html", "css_new");
				var dialog = document.querySelector(".js-new-dialog");
				dialogPolyfill.registerDialog(dialog);
				dialog.showModal();
			},
			closeDialog: function() {
				var dialog = document.querySelector(".js-new-dialog");
				dialog.close();
			},
			openEditDialog: function() {
				this.update("html", "css_about");
				var dialog = document.querySelector(".js-edit-dialog");
				dialogPolyfill.registerDialog(dialog);
				dialog.showModal();
			},
			closeEditDialog: function() {
				var dialog = document.querySelector(".js-edit-dialog");
				dialog.close();
			},
			openRemoveDialog: function() {
				var dialog = document.querySelector(".js-remove-dialog");
				dialogPolyfill.registerDialog(dialog);
				dialog.showModal();
			},
			closeRemoveDialog: function() {
				var dialog = document.querySelector(".js-remove-dialog");
				dialog.close();
			},
			removeAllComponent: function() {
				var dialog = document.querySelector(".js-remove-dialog");
				dialog.close();
				this.data.components = [];
				this.saveData(storageName);
				this.applyMethod("showAlert", "すべてのコンポーネントを削除しました。");
				this.update("html", "css_search_result");
			},
			doneEditDialog: function() {
				this.applyMethod("closeEditDialog");
				this.applyMethod("saveComponent");
				this.update("html", "css_edit");
			},
			clearEditor: function() {
				this.removeData(['name', 'html', 'css']);
				this.saveData(storageName);
				this.update();
			},
			openSettingDialog: function() {
				var dialog = document.querySelector(".js-setting-dialog");
				dialogPolyfill.registerDialog(dialog);
				dialog.showModal();
			},
			closeSettingDialog: function() {
				var dialog = document.querySelector(".js-setting-dialog");
				dialog.close();
			},
			openAboutDialog: function() {
				var dialog = document.querySelector(".js-about-dialog");
				dialogPolyfill.registerDialog(dialog);
				dialog.showModal();
			},
			closeAboutDialog: function() {
				var dialog = document.querySelector(".js-about-dialog");
				dialog.close();
			},
			isGreaterThan: function(text) {
				var cat = this.data.category;
				if (material[cat] > material[text]) {
					return true;
				} else {
					return false;
				}
			},
			runEditor: function(name) {
				var that = this;
				var mode = "";
				if (name == "html") {
					mode = this.data.markup;
				} else if (name == "css") {
					mode = this.data.styling;
				}
				if($("#js-"+name).length == 0){
					return;
				}
				editor = ace.edit("js-" + name);
				editor.setTheme("ace/theme/monokai");
				editor.getSession().setMode("ace/mode/" + name);
				editor.setOptions({
					enableBasicAutocompletion: true,
					enableSnippets: true,
					enableLiveAutocompletion: true
				});
				editor.commands.addCommand({
					name: "save",
					bindKey: {
						win: "Ctrl+S",
						mac: "Command-S"
					},
					exec: function() {
						that.data[name] = editor.getSession().getValue();
						that.applyMethod("saveComponent");
					}
				});
				editor.commands.on("exec", function(e) {
					if (e.command && (e.command.name == "reload" || e.command.name == "save")) {
						e.preventDefault();
						e.command.exec();
					}
				});
				editor.getSession().on('change', function(e) {
					that.data[name] = editor.getSession().getValue();
				});
			},


			/*

			Projects Collection

			*/
			openCollectionsDialog: function() {
				var dialog = document.querySelector(".js-collections-dialog");
				dialogPolyfill.registerDialog(dialog);
				dialog.showModal();
			},
			closeCollectionsDialog: function() {
				var dialog = document.querySelector(".js-collections-dialog");
				dialog.close();
			},
			addToCollection: function() {
				var self = this;
				self.applyMethod("getShortenedUrl")
					.then(function() {
						var obj = {
							projectName: self.data.projectName,
							shortenedUrl: self.data.shortenedUrl
						}
						self.data.collections.push(obj);
						self.saveData(storageName);
						self.update("html", "css_collections");
						self.update("html", "css_project");
						self.applyMethod("showAlert", "プロジェクトをコレクションに追加しました。");
					});
			},
			removeCollection: function(i) {
				var index = this.data.collections.length - i - 1;
				this.data.collections.splice(index, 1);
				this.update("html", "css_collections");
				this.update("html", "css_project");
				this.saveData(storageName);
			},
			updateCollection: function(i) {
				var collections = this.data.collections;
				var index = collections.length - i - 1;
				var project = collections[index];
				project.onEdit = "false";
				this.update("html", "css_collections");
				this.update("html", "css_project");
			},
			renameProject: function(i) {
				var collections = this.data.collections
				var index = collections.length - i - 1;
				var project = collections[index];
				project.onEdit = "true";
				this.update("html", "css_collections");
				this.update("html", "css_project");
			},
			updateProjectUrl: function(i) {
				var self = this;
				var collections = this.data.collections
				var index = collections.length - i - 1;
				var project = collections[index];
				self.applyMethod("getShortenedUrl")
					.then(function(){
						project.shortenedUrl = self.data.shortenedUrl;
						self.update("html","css_collections");
						self.update("html","css_project");
					});
			},
			/*

			 Project Contorl

			 */
			editProjectName: function(i) {
				this.data.projectOnEdit = "true";
				this.update("html", "css_project");
				this.update("html", "css_collections");
			},
			changeProjectName: function(i) {
				this.data.projectOnEdit = "false";
				this.update("html", "css_project");
				this.update("html", "css_collections");
			},
			editProjectDesc: function(i) {
				this.data.projectDescOnEdit = "true";
				this.update("html", "css_project");
				this.update("html", "css_collections");
			},
			changeProjectDesc: function(i) {
				this.data.projectDescOnEdit = "false";
				this.update("html", "css_project");
				this.update("html", "css_collections");
			},
			shareCurrentProject: function(dist) {
				var self = this;
				self.applyMethod("getShortenedUrl")
					.then(function() {

						var obj = {
							shareText: self.data.projectName + " #atomiclab", // current project name
							shortenedUrl: self.data.shortenedUrl // generated URL of current project
						}

						switch (dist) {
							case "slack":
								window.open('http://s7.addthis.com/static/slack.html?shareURL=' + obj.shortenedUrl + '&shareTitle=' + encodeURIComponent(obj.shareText), 'Share a project to your Slack team', 'width=600, height=700, menubar=no, toolbar=no, scrollbars=yes');
								break;
							case "twitter":
								window.open('https://twitter.com/share?url=' + obj.shortenedUrl + '&text=' + encodeURIComponent(obj.shareText), 'Share a project to Twitter', 'width=600, height=290, menubar=no, toolbar=no, scrollbars=yes');
								break;
						}
					});
			}
		},
		convert: {
			preview: function(text) {
				var components = this.getComputedProp("sortByCategory");
				//textからpreview取得
				var preview = parser.getPreview(text);
				preview = compiler.markup[this.data.markup](preview);
				//previewからコメント文取得
				var imports = "" + parser.getImports(text);
				// テンプレート取得
				while (1) {
					var comment = parser.getTag(preview, components);
					if (!comment) {
						break;
					}
					//commentからコンポーネント名取得
					var name = parser.getComponentName(comment);
					var flag = false;
					for (var i = 0, n = components.length; i < n; i++) {
						var comp = components[i];
						if (name == comp.name) {
							flag = true;
							//例えば、atomはmoleculeをincludeできない
							imports += parser.getImports(comp.html);
							if (this.data.id !== comp.id && !this.applyMethod("isGreaterThan", comp.category)) {
								preview = preview.replace(comment, "");
								break;
							}
							// importされてなければ使えない
							if (this.data.id !== comp.id && imports.indexOf(name) == -1) {
								preview = preview.replace(comment, "");
								break;
							}
							var template = parser.getTemplate(comp.html);
							var html = parser.getInnerHtmlFromTemplate(template);
							//templateに自身が含まれていたら削除(無限ループ回避)
							html = parser.removeSelf(html, comp.name);
							var defs = parser.getVarsFromTemplate(template);
							var overrides = parser.getVars(comment);
							html = parser.getRendered(html, defs, overrides);
							preview = preview.replace(comment, compiler.markup[this.data.markup](html));
							break;
						}
					}
					if (!flag) {
						preview = preview.replace(comment, "");
					}
				}
				//スタイルシート取得
				var css = compiler.util.addNormalizeCss();;
				for (var i = 0, n = components.length; i < n; i++) {
					var comp = components[i];
					if (imports.indexOf(comp.name) !== -1 || this.data.id == comp.id) {
						css += comp.css;
					}
				}
				css = compiler.styling[this.data.styling](css);
				css = compiler.util.addParentSelectorToAll(css,".js-preview");
				preview += "<style>" + css + "</style>";
				//todo delete
				if(config.run_script){
					return preview;
				}else{
					return parser.removeScript(preview);
				}
			},
			description:function(text){
				var doc = parser.getDoc(text);
				var desc = parser.getMark("desc",doc);
				return desc;
			},
			note: function(text){
				var note = parser.getNote(text);
				return marked(note);
			},
			deleteScriptTag: function(data) {
				if(config.run_script){
					return data;
				}else{
					return parser.removeScript(data);
				}
			},
			reversedIndex: function(i) {
				return this.data.collections.length - i - 1;
			}
		}
	}).applyMethod("initialize");
	/*ここから先はアニメーション関係*/
	$(".AtomicLabFAB-main").click(function() {
		if ($(this).hasClass("is-open") == false) {
			$(this)
				.css({
					"transform": "rotate(45deg)"
				})
				.addClass("is-open");
			$($(".AtomicLabFAB-subActionsList > li").get().reverse()).each(function() {
				$(this).css({
					"transform": "scale(1) translateY(0px)",
					"opacity": 1
				});
			});
		} else {
			$(this)
				.css({
					"transform": "rotate(0deg)"
				})
				.removeClass("is-open");
			$($(".AtomicLabFAB-subActionsList > li").get().reverse()).each(function() {
				$(this).css({
					"transform": "scale(0) translateY(200px)",
					"opacity": 0
				});
			});
		}
	});
	$(".js-add-category").click(function() {
		var category = $(this).data("category");
		atomicLab.applyMethod("openDialog", category);
	});
	$(window).on('beforeunload', function() {
      return 'Changes you made may not be saved.\nAre you sure you want to leave?';
  });
});
