module.exports = function(){
	var widget_link;
	var iframe;
	var widget_links;
	var target_url;
	widget_links = document.getElementsByClassName('slack-button-widget');
	for (var i = 0; i < widget_links.length; i++) {
	  widget_link = widget_links[i];
	  if (widget_link.dataset.url) {
	      target_url = widget_link.dataset.url;
	  } else {
	      target_url = window.location.href;
	  }
	  iframe = document.createElement('iframe');
	  iframe.setAttribute('src', widget_link.dataset.source + '?url=' + target_url);
	  iframe.setAttribute('width', '100');
	  iframe.setAttribute('height', '22');
	  iframe.setAttribute('frameborder', '0');
	  iframe.setAttribute('scrolling', 'no');
	  widget_link.parentNode.replaceChild(iframe, widget_link);
	}
}
