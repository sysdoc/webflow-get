import { describe, expect, test } from '@jest/globals';
import { pipe, replaceWith } from './core';
import { nullary_,unary_ } from './macros';
import { prop } from './std';

describe("macro nullary_", () => {
    test("", nullary_(pipe([
        nullary_(replaceWith(42)),
        (val) => expect(val).toBe(42),
    ])));
});

describe("macro unary_", () => {
    test("", nullary_(pipe([
        replaceWith(235),
        unary_((val) => val),
        (val) => expect(val).toBe(235),
    ])));
});

describe("macro prop", () => {
    test("", nullary_(pipe([
        replaceWith({ name: "John Doe" }),
        prop("name"),
        (val) => expect(val).toBe("John Doe"),
    ])));
});
