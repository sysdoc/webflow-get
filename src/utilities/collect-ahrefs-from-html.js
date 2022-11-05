import fetch from "node-fetch";
import { captureMatches, pipe } from "../lib/point-free-pipe";



export const collectAHrefs = captureMatches(/href=['"]([^'"]*)['"]/g);



/**
 * @param {string | undefined} baseUrl 
 * @returns {(url: string | undefined) => string}
 */
export const resolveUrlAgainst = (baseUrl) => (url) => baseUrl && url && (new URL(url, baseUrl)).toString();


export const fetchTextContent = pipe([
    fetch,
    (response) => response.text(),
]);