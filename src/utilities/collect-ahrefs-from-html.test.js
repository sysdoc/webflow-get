import { describe, expect, test } from '@jest/globals';
import fetch from 'node-fetch';
import http from 'http';
import { captureMatches, pipe, startsWith, unless_ } from '../lib/point-free-pipe';
import { collectAHrefs, resolveUrlAgainst } from './collect-ahrefs-from-html';

const expectToBe = (value) => (result) => expect(result).toBe(value);
const expectToEqual = (value) => (result) => expect(result).toEqual(value);

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
            arrange: () => ({
                pageUrl: `https://my-domain.com`,
                AHref: `https://my-domain.com/about`,
            }),
            assert: expectToBe(`https://my-domain.com/about`),
        },
        {
            arrange: () => ({
                pageUrl: `https://my-domain.com`,
                AHref: `https://other-domain.com/`,
            }),
            assert: expectToBe(`https://other-domain.com/`),
        },
        {
            arrange: () => ({
                pageUrl: `https://my-domain.com`,
                AHref: `https://other-domain.com`,
            }),
            assert: expectToBe(`https://other-domain.com/`),
        },
        {
            arrange: () => ({
                pageUrl: `https://my-domain.com`,
                AHref: `/`,
            }),
            assert: expectToBe(`https://my-domain.com/`),
        },
        {
            arrange: () => ({
                pageUrl: `https://my-domain.com`,
                AHref: `about`,
            }),
            assert: expectToBe(`https://my-domain.com/about`),
        },
        {
            arrange: () => ({
                pageUrl: `https://my-domain.com/blog`,
                AHref: `about`,
            }),
            assert: expectToBe(`https://my-domain.com/about`),
        },
        {
            arrange: () => ({
                pageUrl: undefined,
                AHref: `https://my-domain.com/blog`,
            }),
            assert: expectToBe(undefined),
        },
        {
            arrange: () => ({
                pageUrl: `https://my-domain.com/blog`,
                AHref: undefined,
            }),
            assert: expectToBe(undefined),
        },
    ])("", async ({ arrange, assert }) => {
        await pipe([
            arrange,
            (given) => {
                return resolveUrlAgainst(given.pageUrl)(given.AHref);
            },
            assert,
        ])();
    });
});


describe("local node server", () => {
    beforeAll(() => {
        startServer();
    });

    test("fetch", async () => {
        const response = await fetch("http://localhost:8080");
        const body = await response.text();
        expect(body).toBe(`href="/about" href="/404"`);
    });
});


const startServer = () => {
    const site = new Map([
        [`/`, `href="/about" href="/404"`],
        [`/about`, `href="/contact"`],
        [`/contact`, `href="/"`],
        [`/blog`, `href="/blog/post-1" href="/blog/post-2" href="/blog/post-3"`],
        [`/blog/post-1`, `href="/blog"`],
        [`/blog/post-2`, `href="/blog"`],
        [`/blog/post-3`, `href="/blog"`],
    ]);

    http
        .createServer()
        .on("request", (req, res) => {
            const html = site.get(req.url);
            res.writeHead(200);
            res.end(html);
        })
        .listen(8080);
};
