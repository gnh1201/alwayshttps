/**
 * @file alwayshttps.js
 * @license http://www.opensource.org/licenses/mit-license.html  MIT License
 * @author Go Namhyeon <gnh1201@gmail.com>
 * @date: 2018-02-17
 */

function alwayshttps_replace_from(uri) {
	return uri.replace("http://", "https://", uri);
}

function alwayshttps_decision(a, b) {
	return ('https:' == window.location.protocol) ? a : b;
}

function alwayshttps_redirect() {
	if(!alwayshttps_decision(true, false)) {
		location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
	}
}

function alwayshttps_dom() {
	var secureTagNames = [
		'meta', 'link', 'script', 'embed', 'iframe',
		'img', 'input', 'source', 'audio', 'video',
		'track', 'a', 'form', 'object', 'area', 'applet'
	];

	for(var i in secureTagNames) {
		var doms = document.getElementsByTagName(secureTagNames[i]);
		for(var k in doms) {
			var domUri = "";
			var domAttrName = "";
			var secureDomUri = "";

			switch(secureTagNames[i]) {
				// meta->content
				case "meta":
					domAttrName = "content";
					break;

				// link->href, a->href, area->href
				case "link":
				case "a":
				case "area":
					domAttrName = "href";
					break;

				// form->action
				case "form":
					domAttrName = "action";
					break;

				// script->src, embed->src, iframe->src, img->src, input->src
				// source->src, audio->src, video->src, track->src
				case "script":
				case "embed":
				case "iframe":
				case "img":
				case "input":
				case "source":
				case "audio":
				case "video":
				case "track":
					domAttrName = "src";
					break;

				// object->data
				case "object":
					domAttrName = "data";
					break;

				// applet->codebase
				case "applet":
					domAttrName = "codebase";
					break;

				default:
					domAttrName = "";
			}

			// get uri of dom element
			if(doms[k] != null && typeof(doms[k].getAttribute) !== "undefined") {
				domUri = doms[k].getAttribute(domAttrName);
			}

			// detect http, and replace to https
			if(domUri != null && domUri.indexOf("http://") > -1) {
				secureDomUri = alwayshttps_replace_from(domUri);
				doms[k].setAttribute(domAttrName, secureDomUri);
			}
		}
	}
}

function alwayshttps_load() {
	alwayshttps_redirect();
	alwayshttps_dom();
}

// load alwayshttps when ready document
if(typeof(jQuery) !== "undefined") {
	jQuery(document).ready(function() { alwayshttps_load(); });
} else {
	window.onload = function() { alwayshttps_load(); };
}
