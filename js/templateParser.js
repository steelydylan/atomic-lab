(function(global){

	var parseTemplate = function(text){

	};

	global.parseTemplate = parseTemplate;
})(window);

console.log(parseTemplate('<!-- template modifier="" text="button" --><button class="button {modifiler}">{text}</button><!-- /template --><!-- preview --><!-- Button modifier="" text="default" --><!-- Button modifier="button-red" text="red" --><!-- /preview -->'));
