import { describe, expect, test } from '@jest/globals';
import http from 'http';
import { captureMatches, pipe, startsWith, unless_, use, map, if_, not, sideEffect as sideEffect, forEach } from '../lib/point-free-pipe';
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
            arrange: use({
                pageUrl: `https://my-domain.com`,
                AHref: `https://my-domain.com/about`,
            }),
            assert: expectToBe(`https://my-domain.com/about`),
        },
        {
            arrange: use({
                pageUrl: `https://my-domain.com`,
                AHref: `https://other-domain.com/`,
            }),
            assert: expectToBe(`https://other-domain.com/`),
        },
        {
            arrange: use({
                pageUrl: `https://my-domain.com`,
                AHref: `https://other-domain.com`,
            }),
            assert: expectToBe(`https://other-domain.com/`),
        },
        {
            arrange: use({
                pageUrl: `https://my-domain.com`,
                AHref: `/`,
            }),
            assert: expectToBe(`https://my-domain.com/`),
        },
        {
            arrange: use({
                pageUrl: `https://my-domain.com`,
                AHref: `about`,
            }),
            assert: expectToBe(`https://my-domain.com/about`),
        },
        {
            arrange: use({
                pageUrl: `https://my-domain.com/blog`,
                AHref: `about`,
            }),
            assert: expectToBe(`https://my-domain.com/about`),
        },
        {
            arrange: use({
                pageUrl: undefined,
                AHref: `https://my-domain.com/blog`,
            }),
            assert: expectToBe(undefined),
        },
        {
            arrange: use({
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
        use(`http://localhost:8080`),
        fetchTextContent,
        expectToBe(`href="/about" href="/404"`),
    ])());

    test("", async () => await pipe([
        use(`http://localhost:8080/404`),
        fetchTextContent,
        expectToBe(undefined),
    ])());

    afterAll(localServer.close);
});



// describe("fn crawlSite", () => {
//     const localServer = createServer(8081);
//     beforeAll(localServer.listen);

//     test("", async () => await pipe([
//         use([`http://localhost:8081`]),
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