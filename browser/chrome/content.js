const baseUrl = "https://mkkp-hoax-radar.lazos.me/";
let MKKP_BLACKLIST = [];

/**
 * Wait for DOM ready event
 */
window.addEventListener('DOMContentLoaded', e => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", baseUrl + "blacklist/", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const hostname = window.location.hostname;
      const blacklist = JSON.parse(xhr.responseText);
      MKKP_BLACKLIST = blacklist;

      if (window.location.href.indexOf('facebook.com') > -1) {
        startUrlMonitor();
        return;
      }

      blacklist.forEach(item => {
        const domain = unescape(item.domain);

        if (window.location.href.indexOf(trimSlash(domain)) > -1 || hostname === domain) {
          displayOverlay(item.alert, item.image, item.auditor);
        }
      });
    }
  };
  xhr.send();
});


/**
 * Checks if string ends with / and removes it
 */
function trimSlash(str) {
  return (str[str.length - 1] === '/') ? str.substr(0, str.length - 1) : str;
}


/**
 * If on sites like Facebook, where the navigation is AJAX based monitor the URL changes
 */
function startUrlMonitor(domain) {
  let prevUrl = '';

  setInterval(() => {
    if (prevUrl !== window.location.href) {
      MKKP_BLACKLIST.forEach(item => {
        if (window.location.href.indexOf(trimSlash(item.domain)) > -1) {
          displayOverlay(item.alert, item.image, item.auditor);
        }
      });
    }
    prevUrl = window.location.href;
  }, 500);
}

/**
 * Generates and injects the overlay
 */
function displayOverlay(alertText, image, auditor) {
  let overlay = getOverlayHTML(alertText, image, auditor);
  let wrapper = document.createElement('div');
  wrapper.innerHTML = overlay;
  document.body.appendChild(wrapper);
}

/**
 * Returns the overlay HTML
 * @param {Flashing text} alertText
 * @param {GIF to display} image
 * @param {auditor hostname} auditor
 */
function getOverlayHTML(alertText, image, auditor) {
  return `<div id="mkkp-hoax-radar-overlay">
      <div id="mkkp-hoax-radar-text">
          <span>${alertText}</span>
      </div>
      <div id="mkkp-hoax-radar-dance">
          <img src="${image}">
      </div>
      <div id="mkkp-hoax-radar-link">
          Auditálta:
          <a href="http://${auditor}" target="_blank">${auditor}</a>
          <br/>
          Ha valami kimaradt a listából, <a href="https://docs.google.com/forms/d/e/1FAIpQLScPkkWxC4Af0vqNJi0Mz6yu5-aX6vdcrBNFmc08COS7-LMFXA/viewform" target="_blank">itt tudod nekünk elküldeni</a>!
      </div>
      <div id="mkkp-hoax-radar-close" onclick="var element = document.getElementById('mkkp-hoax-radar-overlay'); element.outerHTML = '';">
          X
      </div>
  </div>`;
}