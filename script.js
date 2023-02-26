// ==UserScript==
// @name            Instagram: Fix Image Linking
// @name:de         Instagram: Bildlink beheben
// @version         1.0.0
// @description     Fix Right Click on Image to Download & User Mentions Button on Instagram browsing as Guest
// @description:de  Behebe Rechtsklick aufs Bild zum Herunterladen & User Verlinkungen/Erwähnungen Button auf Instagram beim Browsen als Gast
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/instagram-fix-image-linking
// @license         MIT
// @match           https://www.instagram.com/p/*
// @grant           none
// ==/UserScript==

(function () {
    'use strict';
	
	function init() {		
		const img = document.querySelector("img[crossorigin]");
		
		if (! img) {
			return;
		}
		
		clearInterval(i);

		// Right click to download image
		img.parentNode.parentNode.querySelector("div:nth-child(2)").remove();

		// Cursor
		img.parentNode.parentNode.parentNode.style.cursor = "default";
		
		// Fix user mentions
		let active = false;
		document.querySelector("button svg").parentNode.parentNode.onclick = function() {
			if (! active) {
				active = true;

				img.parentNode.parentNode.parentNode.querySelectorAll("a").forEach((o) => {
					o.parentNode.style.opacity = 1;
					o.parentNode.style.transform = "translate(-50%, 0%)";
					o.parentNode.style.pointerEvents = "inherit"
				});
			} else {
				active = false;

				img.parentNode.parentNode.parentNode.querySelectorAll("a").forEach((o) => {
					o.parentNode.style.transform = "translate(-50%, 0%) scale(0)";
				});
			}
		};
	}
	
	const i = window.setInterval(init, 500);
})();