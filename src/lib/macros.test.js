import { describe, expect, test } from '@jest/globals';
import { pipe, replaceWith } from './core';
import { nullary_, unary_ } from './macros';

describe("fn nullary_", () => {
    test("", nullary_(pipe([
        nullary_(replaceWith(42)),
        (val) => expect(val).toBe(42),
    ])));
});

describe("fn unary_", () => {
    test("", nullary_(pipe([
        replaceWith(235),
        unary_((val) => val),
        (val) => expect(val).toBe(235),
    ])));
});