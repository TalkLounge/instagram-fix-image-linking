// ==UserScript==
// @name            Instagram: Fix Image Linking
// @name:de         Instagram: Bildlink beheben
// @version         1.1.3
// @description     Fix Right Click on Image/Video to Download & User Mentions Button on Instagram browsing as Guest
// @description:de  Behebe Rechtsklick aufs Bild/Video zum Herunterladen & User Verlinkungen/Erwähnungen Button auf Instagram beim Browsen als Gast
// @icon            https://static.cdninstagram.com/rsrc.php/y4/r/QaBlI0OZiks.ico
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/instagram-fix-image-linking
// @license         MIT
// @match           https://www.instagram.com/p/*
// @match           https://www.instagram.com/*/p/*
// @match           https://www.instagram.com/reel/*
// @match           https://www.instagram.com/*/reel/*
// @grant           none
// ==/UserScript==

// Test Image with Tags: https://www.instagram.com/jesse_tl_/p/CmlWRARrL07/
// Test Video: https://www.instagram.com/jesse_tl_/reel/CJU6gKvhGf_/
// Test Carousel: https://www.instagram.com/p/CmLDljMhEtY/
(function () {
    'use strict';

    function modifyDOM() {
        const imgs = [...document.querySelectorAll("article img[style]")].concat([...document.querySelectorAll("article video")]);

        let actives = [];
        for (let i = 0; i < imgs.length; i++) {
            if (imgs[i].tagName == "IMG") {
                // Right click to download image
                imgs[i].parentNode.parentNode.querySelector("div:nth-child(2)")?.remove();

                // Cursor
                imgs[i].parentNode.parentNode.parentNode.style.cursor = "default";

                // Disable login popup
                imgs[i].onclick = () => {
                    event.stopPropagation();
                }
            } else if (imgs[i].tagName == "VIDEO") {
                // Right click to download video
                imgs[i].parentNode.querySelector("div:nth-child(2)")?.remove();

                // Show video controls
                imgs[i].controls = true;

                // Mute video
                imgs[i].addEventListener("play", (event) => {
                    event.target.muted = false;
                });
            }

            // Fix user mentions
            actives[i] = false;

            if (!imgs[i].parentNode.parentNode.parentNode.querySelector("button svg")) { // Skip when no user mentions
                continue;
            }

            imgs[i].parentNode.parentNode.parentNode.querySelector("button svg").parentNode.parentNode.onclick = () => {
                const j = i;
                event.stopPropagation();

                if (!actives[j]) {
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

    function isBackButton() {
        if (document.querySelectorAll("article button:not(ul *)[aria-label]").length <= 1) {
            return;
        }

        document.querySelector("article button:not(ul *)[aria-label]").onclick = modifyDOM;
    }

    function init() {
        if (! [...document.querySelectorAll("article img[style]")].concat([...document.querySelectorAll("article video")]).length) {
            return;
        }

        clearInterval(interval);

        modifyDOM();

        const nextButton = document.querySelector("article button:not(ul *)[aria-label]");
        if (nextButton) {
            nextButton.onclick = modifyDOM;
            window.setInterval(isBackButton, 1000);
        }
    }

    const interval = window.setInterval(init, 500);
})();
