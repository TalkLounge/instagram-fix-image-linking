// ==UserScript==
// @name            Instagram: Fix Image Linking
// @name:de         Instagram: Bildlink beheben
// @version         1.1.0
// @description     Fix Right Click on Image/Video to Download & User Mentions Button on Instagram browsing as Guest
// @description:de  Behebe Rechtsklick aufs Bild/Video zum Herunterladen & User Verlinkungen/Erwähnungen Button auf Instagram beim Browsen als Gast
// @icon            https://static.cdninstagram.com/rsrc.php/y4/r/QaBlI0OZiks.ico
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/instagram-fix-image-linking
// @license         MIT
// @match           https://www.instagram.com/p/*
// @grant           none
// ==/UserScript==

(function () {
    'use strict';

	function init() {
		const imgs = [...document.querySelectorAll("article img[style]")].concat([...document.querySelectorAll("article video")]);

		if (! imgs.length) {
			return;
		}

		clearInterval(interval);

        let actives = [];
        for (let i = 0; i < imgs.length; i++) {
            // Right click to download image
            imgs[i].parentNode.parentNode.querySelector("div:nth-child(2)").remove();

            // Cursor
            imgs[i].parentNode.parentNode.parentNode.style.cursor = "default";

            // Fix user mentions
            actives[i] = false;

            if (! imgs[i].parentNode.parentNode.parentNode.querySelector("button svg")) { // Skip when no user mentions
                continue;
            }

            imgs[i].parentNode.parentNode.parentNode.querySelector("button svg").parentNode.parentNode.onclick = function() {
                const j = i;
                event.stopPropagation();

                if (! actives[j]) {
                    actives[j] = true;

                    imgs[j].parentNode.parentNode.parentNode.querySelectorAll("a").forEach((item) => {
                        item.parentNode.style.opacity = 1;
                        item.parentNode.style.transform = item.parentNode.style.transform.replace(" scale(0)", "");
                        item.parentNode.style.pointerEvents = "inherit"
                    });
                } else {
                    actives[j] = false;

                    imgs[j].parentNode.parentNode.parentNode.querySelectorAll("a").forEach((item) => {
                        item.parentNode.style.opacity = 0;
                    });
                }
            }
        }
	}

	const interval = window.setInterval(init, 500);
})();
