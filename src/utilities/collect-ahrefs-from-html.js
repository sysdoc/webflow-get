import fetch from "node-fetch";
import { if_, string_, setValue, throwError, isString, isUndefined, isUndef, getValue } from "../lib/core";
import { allFalse_, anyTrue_, assert_ } from "../lib/macros";
import { function_ } from "../lib/pipe";
import { captureMatches, getProp, log, unless_, if___, unless_alt, passTo } from "../lib/point-free-pipe";
import { callMethod, isFalse, not, prop } from "../lib/std";



export const collectAHrefs = captureMatches(/href=['"]([^'"]*)['"]/g);



/**
 * @param {string | undefined} baseUrl 
 * @returns {(url: string | undefined) => string | undefined}
 */
export const resolveUrlAgainst = (baseUrl) => (url) => baseUrl && url && (new URL(url, baseUrl)).toString();


export const fetchTextContent = function_([
    assert_(anyTrue_(isString, isUndef)),
    fetch,
    if_([prop("ok"), isFalse], [
        setValue(undefined),
    ]),
    if_([prop("ok"), isFalse], {
        then: [
            setValue(undefined),
        ],
        else: [
            getValue,
        ],
    }),
    if_([prop("ok"), isFalse], {
        then: [setValue(undefined)],
        else: [getValue],
    }),
    if_([prop("ok"), isFalse], {
        then: [setValue(undefined)],
    }),
    callMethod("text", []),
]);
