import { describe, expect, test } from '@jest/globals';
import http from 'http';
import { pipe } from '../lib/core';
import { captureMatches, startsWith, unless_, map, not, sideEffect as sideEffect, forEach, useValue } from '../lib/point-free-pipe';
import { collectAHrefs, fetchTextContent, resolveUrlAgainst } from './collect-ahrefs-from-html';

const expectToBe = (result) => expect(result).toBe;
const expectToEqual = (result) => expect(result).toEqual;



describe("fn collectAHrefs", () => {
    test.each([
        {
            given: {
                html: `<a href="/about">About Us</a>`,
            },
            assert: expectToEqual([`/about`]),
        },
        {
            given: {
                html: `<a href="/about">About Us</a> <a href="/">About Us</a>`,
            },
            assert: expectToEqual([`/about`, `/`]),
        },
        {
            given: {
                html: `<a href='/about'>About Us</a>`,
            },
            assert: expectToEqual([`/about`]),
        },
    ])("", async ({ given, assert }) => {
        await pipe([
            () => given.html,
            collectAHrefs,
            assert,
        ])();
    });
});



describe("fn resolveUrl", () => {
    test.each([
        {
            arrange: useValue({
                pageUrl: `https://my-domain.com`,
                AHref: `https://my-domain.com/about`,
            }),
            assert: expectToBe(`https://my-domain.com/about`),
        },
        {
            arrange: useValue({
                pageUrl: `https://my-domain.com`,
                AHref: `https://other-domain.com/`,
            }),
            assert: expectToBe(`https://other-domain.com/`),
        },
        {
            arrange: useValue({
                pageUrl: `https://my-domain.com`,
                AHref: `https://other-domain.com`,
            }),
            assert: expectToBe(`https://other-domain.com/`),
        },
        {
            arrange: useValue({
                pageUrl: `https://my-domain.com`,
                AHref: `/`,
            }),
            assert: expectToBe(`https://my-domain.com/`),
        },
        {
            arrange: useValue({
                pageUrl: `https://my-domain.com`,
                AHref: `about`,
            }),
            assert: expectToBe(`https://my-domain.com/about`),
        },
        {
            arrange: useValue({
                pageUrl: `https://my-domain.com/blog`,
                AHref: `about`,
            }),
            assert: expectToBe(`https://my-domain.com/about`),
        },
        {
            arrange: useValue({
                pageUrl: undefined,
                AHref: `https://my-domain.com/blog`,
            }),
            assert: expectToBe(undefined),
        },
        {
            arrange: useValue({
                pageUrl: `https://my-domain.com/blog`,
                AHref: undefined,
            }),
            assert: expectToBe(undefined),
        },
    ])("", async ({ arrange, assert }) => {
        await pipe([
            arrange,
            (given) => resolveUrlAgainst(given["pageUrl"])(given["AHref"]),
            assert,
        ])();
    });
});



const createServer = (port) => {
    const site = new Map([
        [`/`, `href="/about" href="/404"`],
        [`/about`, `href="/contact"`],
        [`/contact`, `href="/"`],
        [`/blog`, `href="/blog/post-1" href="/blog/post-2" href="/blog/post-3"`],
        [`/blog/post-1`, `href="/blog"`],
        [`/blog/post-2`, `href="/blog"`],
        [`/blog/post-3`, `href="/blog"`],
    ]);

    const server = http
        .createServer()
        .on("request", (req, res) => {
            const html = req.url ? site.get(req.url) : undefined;
            res.writeHead(
                html === undefined
                    ? 404
                    : 200
            );
            res.end(html);
        })

    return Object.freeze({
        listen() {
            server.listen(port);
        },
        close() {
            server.close();
        }
    });
};



describe("fn fetchTextContent", () => {
    const localServer = createServer(8080);
    beforeAll(localServer.listen);

    test("", async () => await pipe([
        useValue(`http://localhost:8080`),
        fetchTextContent,
        expectToBe(`href="/about" href="/404"`),
    ])());

    test("", async () => await pipe([
        useValue(`http://localhost:8080/404`),
        fetchTextContent,
        expectToBe(undefined),
    ])());

    afterAll(localServer.close);
});



// describe("fn crawlSite", () => {
//     const localServer = createServer(8081);
//     beforeAll(localServer.listen);

//     test("", async () => await pipe([
//         useValue([`http://localhost:8081`]),
//         // guardInput(checkIfUniquie),
//         // (function loop(previousValues) {
//         //     return if_([previousValues.has, not]).then([
//         //         sideEffect([
//         //             previousValues.add,
//         //         ]),
//         pipe([
//             fetchTextContent,
//             collectAHrefs,
//             map([resolveUrlAgainst(`https://localhost:8081`)]),
//         ]),
//         //         forEach([
//         //             loop(previousValues),
//         //         ]),
//         //     ]);
//         // })(new Set()),
//     ])());

//     afterAll(localServer.close);
// });