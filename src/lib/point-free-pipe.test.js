import { describe, expect, test } from '@jest/globals';
import { eq, gt, gte, lt, lte } from './point-free-pipe';

describe("curried small utility functions", () => {
    test("eq", () => {
        expect(eq(5)(5)).toBe(true);
        expect(eq(5)(7)).toBe(false);
        expect(eq({})({})).toBe(false);
    });

    test("lt", () => {
        expect(lt(5)(3)).toBe(true);
        expect(lt(5)(7)).toBe(false);
        expect(lt(5)(5)).toBe(false);
    });

    test("lte", () => {
        expect(lte(5)(3)).toBe(true);
        expect(lte(5)(7)).toBe(false);
        expect(lte(5)(5)).toBe(true);
    });

    test("gt", () => {
        expect(gt(5)(3)).toBe(false);
        expect(gt(5)(7)).toBe(true);
        expect(gt(5)(5)).toBe(false);
    });

    test("gte", () => {
        expect(gte(5)(3)).toBe(false);
        expect(gte(5)(7)).toBe(true);
        expect(gte(5)(5)).toBe(true);
    });
});



describe("pipe function", () => {
    test.each([
        {
            given: {
                value: 3,
                transforms: [
                    lt(5),
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
                    lt(5),
                    eq(true),
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
                    async (value) => lt(5)(value),
                    eq(true),
                ],
            },
            then(result) {
                expect(result).toBe(true);
            },
        },
    ])("pipe", async ({ given, then }) => {
        const pipe = (transforms) => async (value) => {
            for (const transform of transforms) {
                value = await transform(value);
            }

            return value;
        }

        const result = await pipe(given.transforms)(given.value);
        then(result);
    });
});
