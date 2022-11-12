import { describe, expect, test } from '@jest/globals';
import { eq_, gte_, gt_, lte_, lt_, pipe, setValue } from './core';
import { captureMatches, map, useValue, log } from './point-free-pipe';
import { expectToBe } from './test-helpers';

describe("curried small utility functions", () => {
    test("eq", async () => {
        expect(await eq_(5)(5)).toBe(true);
        expect(await eq_(5)(7)).toBe(false);
        expect(await eq_({})({})).toBe(false);
    });

    test("lt", async () => {
        expect(await lt_(5)(3)).toBe(true);
        expect(await lt_(5)(7)).toBe(false);
        expect(await lt_(5)(5)).toBe(false);
    });

    test("lte", async () => {
        expect(await lte_(5)(3)).toBe(true);
        expect(await lte_(5)(7)).toBe(false);
        expect(await lte_(5)(5)).toBe(true);
    });

    test("gt", async () => {
        expect(await gt_(5)(3)).toBe(false);
        expect(await gt_(5)(7)).toBe(true);
        expect(await gt_(5)(5)).toBe(false);
    });

    test("gte", async () => {
        expect(await gte_(5)(3)).toBe(false);
        expect(await gte_(5)(7)).toBe(true);
        expect(await gte_(5)(5)).toBe(true);
    });
});



describe("pipe function", () => {
    test.each([
        {
            given: {
                value: 3,
                transforms: [
                    lt_(5),
                ],
            },
            then(result) {
                expect(result).toBe(true);
            },
        },
        {
            given: {
                value: 3,
                transforms: [
                    lt_(5),
                    eq_(true),
                ],
            },
            then(result) {
                expect(result).toBe(true);
            },
        },
        {
            given: {
                value: 3,
                transforms: [
                    async (value) => lt_(5)(value),
                    eq_(true),
                ],
            },
            then(result) {
                expect(result).toBe(true);
            },
        },
    ])("pipe", async ({ given, then }) => {
        const result = await pipe(given.transforms)(given.value);
        then(result);
    });
});


describe("fn captureMatches", () => {
    test.each([
        {
            arrange: useValue({
                string: `<a href="/about">About Us</a> <a href="/">Home</a>`,
                regex: /href="([^"]*)"/g,
            }),
            assert(result) {
                expect(result).toEqual([`/about`, `/`]);
            },
        },
        {
            arrange: useValue({
                string: undefined,
                regex: /href="([^"]*)"/g,
            }),
            assert(result) {
                expect(result).toEqual([]);
            },
        },
        {
            arrange: useValue({
                string: `<a href="/about">About Us</a> <a href="/">Home</a>`,
                regex: undefined,
            }),
            assert(result) {
                expect(result).toEqual([]);
            },
        },
    ])("", async ({ arrange, assert }) => {
        await pipe([
            arrange,
            (given) => captureMatches(given["regex"])(given["string"]),
            assert,
        ])();
    });
});



describe("fn captureMatches", () => {
    test.each([
        {
            given: {
                string: `<a href="/about">About Us</a> <a href="/">Home</a>`,
                regex: /href="([^"]*)"/g,
            },
            expected: [`/about`, `/`],
        },

        {
            given: {
                string: undefined,
                regex: /href="([^"]*)"/g,
            },
            expected: [],
        },

        {
            given: {
                string: `<a href="/about">About Us</a> <a href="/">Home</a>`,
                regex: undefined,
            },
            expected: [],
        },
    ])("", async ({ given, expected }) => {
        await pipe([
            setValue(given),
            (given) => captureMatches(given["regex"])(given["string"]),
            expectToBe(expected),
        ])();
    });
});

