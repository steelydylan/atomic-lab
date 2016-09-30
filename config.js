var config = {
	title:"Atomic Lab.",
	/*
		read data from jsonfile
		instead of localstorage
	*/
	read_from_local_file:true,
	/*
	*/
	local_file_path:"./resources/setting.json",
	/*
		run js on preview mode
	*/
	run_script:true,
	/*
		used for Google URL shortener
	*/
	use_url_shortener:true,
	key:"AIzaSyDNu-_s700JSm7SXzLWVt3Rku5ZwbpaQZA",
	css_dependencies:[

	],
	markup:"ejs",//html,ejs,jade,haml
	styling:"sass",//css,sass,less,stylus
	parser:{
		preview:{
			start:/<!--@preview/g,
			end:/-->/g,
			body:/<!--@preview(([\n\r\t]|.)*?)-->/g
		},
		note:{
			start:/<!--@note/g,
			end:/-->/g,
			body:/<!--@note(([\n\r\t]|.)*?)-->/g
		},
		template:{
			start:/<!--@template(.*?)-->/g,
			end:/<!--@\/template(.*?)-->/g,
			body:/<!--@template(.*?)-->(([\n\r\t]|.)*?)<!--@\/template(.*?)-->/g
		},
		doc:{
			start:/<!--@doc/g,
			end:/-->/g,
			body:/<!--@doc(([\n\r\t]|.)*?)-->/g
		},
		import:{
			body:/<!--@import parts="(.*?)" -->/
		},
		variable:{
			mark:/{(.*?)}/g
		}
	}
}
