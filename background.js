var __chrome;
if (typeof 'chrome' !== 'undefined') {
    __chrome = chrome;
} else if (typeof 'browser' !== 'undefined') {
    __chrome = browser;
} else {

}
var chrome = __chrome;

/**
 * show popup on specific url
 */
// chrome.runtime.onInstalled.addListener(function () {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
//         chrome.declarativeContent.onPageChanged.addRules([{
//             conditions: [
//                 new chrome.declarativeContent.PageStateMatcher({
//                     pageUrl: { hostEquals: 'www.google.com' },
//                 })
//             ],
//             actions: [new chrome.declarativeContent.ShowPageAction()]
//         }]);
//     });
// });

function getParams(search) {
    const params = {};
    search
        .slice(1)
        .split('&')
        .map(e => e.split('='))
        .forEach(e => params[e[0]] = e[1]);
    return params;
}

function createURL(location, options) {
    const queryString = Object.keys(options).map(k => `${k}=${options[k]}`).join('&');
    return `${location.protocol}//${location.hostname}${location.pathname}?${queryString}`;
}

let prevUrl = null;

/**
 * listen onBeforeNavigate to force navigating to `current` gl
 */
chrome.webNavigation.onBeforeNavigate.addListener((e) => {
    const url = new URL(e.url);
    if (url.hostname === 'www.google.com' && e.parentFrameId === -1) {
        // chrome.pageAction.show(e.tabId);
        chrome.storage.sync.get(['current'], function (result) {
            console.log('current gl: ' + result.current);
            const params = getParams(url.search);
            if (result.current && params.gl !== result.current) {
                params.gl = result.current;
                const newUrl = createURL(url, params);
                if (prevUrl !== newUrl) {
                    console.log('navigate to:', newUrl);
                    chrome.tabs.update(e.tabId, { url: newUrl });
                    prevUrl = newUrl;
                }
            }

            if (params.tbs) {
                chrome.storage.sync.set({ tbs: e.detail.tbs }, function () {
                    console.log('current tbs changed to ' + e.detail.tbs);
                });
            } else {
                chrome.storage.sync.get(['tbs'], function (result) {
                    result.tbs
                });
            }
        });
    }
});