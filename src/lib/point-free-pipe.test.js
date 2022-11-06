import { describe, expect, test } from '@jest/globals';
import { captureMatches, isEq, isGt, isGtEq, isLt, isLtEq, map, pipe, use, log } from './point-free-pipe';

describe("curried small utility functions", () => {
    test("eq", async () => {
        expect(await isEq(5)(5)).toBe(true);
        expect(await isEq(5)(7)).toBe(false);
        expect(await isEq({})({})).toBe(false);
    });

    test("lt", async () => {
        expect(await isLt(5)(3)).toBe(true);
        expect(await isLt(5)(7)).toBe(false);
        expect(await isLt(5)(5)).toBe(false);
    });

    test("lte", async () => {
        expect(await isLtEq(5)(3)).toBe(true);
        expect(await isLtEq(5)(7)).toBe(false);
        expect(await isLtEq(5)(5)).toBe(true);
    });

    test("gt", async () => {
        expect(await isGt(5)(3)).toBe(false);
        expect(await isGt(5)(7)).toBe(true);
        expect(await isGt(5)(5)).toBe(false);
    });

    test("gte", async () => {
        expect(await isGtEq(5)(3)).toBe(false);
        expect(await isGtEq(5)(7)).toBe(true);
        expect(await isGtEq(5)(5)).toBe(true);
    });
});



describe("pipe function", () => {
    test.each([
        {
            given: {
                value: 3,
                transforms: [
                    isLt(5),
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
                    isLt(5),
                    isEq(true),
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
                    async (value) => isLt(5)(value),
                    isEq(true),
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
            arrange: use({
                string: `<a href="/about">About Us</a> <a href="/">Home</a>`,
                regex: /href="([^"]*)"/g,
            }),
            assert(result) {
                expect(result).toEqual([`/about`, `/`]);
            },
        },
        {
            arrange: use({
                string: undefined,
                regex: /href="([^"]*)"/g,
            }),
            assert(result) {
                expect(result).toEqual([]);
            },
        },
        {
            arrange: use({
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

