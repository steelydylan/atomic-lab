(function(global){

	var parseTemplate = function(text){
		console.log(text.match(/<!-- preview -->(.*)<!-- \/preview -->/g));
		return text;
	};

	global.parseTemplate = parseTemplate;
})(window);

parseTemplate('<!-- template modifier="" text="button" --><button class="button {modifiler}">{text}</button><!-- /template --><!-- preview --><!-- Button modifier="" text="default" --><!-- Button modifier="button-red" text="red" --><!-- /preview -->');
