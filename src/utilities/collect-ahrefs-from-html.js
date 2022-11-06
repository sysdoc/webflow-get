import fetch from "node-fetch";
import { captureMatches, getProp, log, pipe, use, callMethod, isGtEq, unless_, if_, unless_alt, passTo, isString} from "../lib/point-free-pipe";



export const collectAHrefs = captureMatches(/href=['"]([^'"]*)['"]/g);



/**
 * @param {string | undefined} baseUrl 
 * @returns {(url: string | undefined) => string | undefined}
 */
export const resolveUrlAgainst = (baseUrl) => (url) => baseUrl && url && (new URL(url, baseUrl)).toString();


export const fetchTextContent = if_([isString]).then([
    (/** @type String */ str) => fetch(str),
    unless_alt([getProp("ok")]).then([
        use(undefined),
    ]),
    callMethod("text").withArguments(),
]);