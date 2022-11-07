import fetch from "node-fetch";
import { string_ } from "../lib/core";
import { captureMatches, getProp, log, useValue, callMethod, unless_, if___, unless_alt, passTo} from "../lib/point-free-pipe";



export const collectAHrefs = captureMatches(/href=['"]([^'"]*)['"]/g);



/**
 * @param {string | undefined} baseUrl 
 * @returns {(url: string | undefined) => string | undefined}
 */
export const resolveUrlAgainst = (baseUrl) => (url) => baseUrl && url && (new URL(url, baseUrl)).toString();


export const fetchTextContent = if___([string_]).then([
    (/** @type String */ str) => fetch(str),
    unless_alt([getProp("ok")]).then([
        useValue(undefined),
    ]),
    callMethod("text").withArguments(),
]);