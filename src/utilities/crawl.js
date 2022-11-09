import { forEach_, map_ } from "../lib/arrays";
import { if_, replaceWith, sideEffect, value_ } from "../lib/core";
import { function_, pipe_ } from "../lib/pipe";
import { stack_ } from "../lib/stack";
import { call, currentValue, not, not_, prop, useCurrentValue } from "../lib/std";
import { collectAHrefs, fetchTextContent, resolveUrlAgainst } from "./collect-ahrefs-from-html";

export const snapshotDiscoverablePages = (function self(/** @type Map */ accumulatedPages, nextUrls) {
    stack_(nextUrls, [
        map_(
            pipe_([
                if_(not_(accumulatedPages.has),
                    pipe_([
                        tuple_([forwardValue, fetchTextContent]),
                        spreadTo_(storeFile),
                        collectAHrefs,
                        map_(
                            pipe_([
                                resolveUrlAgainst("https://localhost:8080"),
                                self,
                            ]),
                        ),
                    ]),
                ),
            ]),
        ),
    ])();
});


function storeFile({ fileUri, textContent }) { }


export const snapshotDiscoverablePagesAlt = (function self(/** @type Map */ accumulatedPages, nextUrls) {
    call(function_([
        value_(nextUrls),
        forEach_([
            /* url */
            if_([accumulatedPages.has, not], [
                urlToPage,
                sideEffect([
                    pageToFile,
                    storeFile,
                ]),
                prop("html"),
                collectAHrefs,
                forEach_([
                    resolveUrlAgainst("https://localhost:8080"),
                ]),
            ]),
        ]),
    ]));
});



const urlToPage = function_([
    { url: [currentValue], html: [fetchTextContent] },
]);

const pageToFile = function ()

// stack_ could be the function which builds an array of 