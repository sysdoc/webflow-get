import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 519:
/***/ ((module) => {

module.exports = eval("require")("./lib/continuation-passing");


/***/ }),

/***/ 264:
/***/ ((module) => {

module.exports = eval("require")("./utilities");


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: external "fs/promises"
const promises_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs/promises");
// EXTERNAL MODULE: ../../../.nvm/versions/node/v18.12.1/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?./lib/continuation-passing
var continuation_passing = __nccwpck_require__(519);
// EXTERNAL MODULE: ../../../.nvm/versions/node/v18.12.1/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?./utilities
var _notfoundutilities = __nccwpck_require__(264);
;// CONCATENATED MODULE: ./src/index.js





const getWebUrlContent = _notfoundutilities.htmlFromFullUrl;
const extractWebflowPublishDate = _notfoundutilities.webflowPublishedDateFrom;


const softUpdateSnapshot = async function () {
    if (await getWebflowPublishDate() <= await getLocalSnapshotDate(".timestamp")) {
        return;
    }

    await updateSnapshot();
}



const getWebflowPublishDate = (0,continuation_passing.pipe)([
    () => ("config.json"),
    _notfoundutilities.readFileContent,
    JSON.parse,
    (0,continuation_passing.getProperty)("webflowSiteBaseUrl"),

    getWebUrlContent,

    extractWebflowPublishDate,
]);

async function main() {
    await (0,_notfoundutilities.updateSnapshot)();
}

main()
    .then(() => {
        console.log('Executed successfully')
    })
    .catch((error) => {
        console.error(error)
        core.setFailed(error.message)
    })

})();

