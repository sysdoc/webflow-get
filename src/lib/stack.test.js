import { describe, expect, test } from '@jest/globals';
import { pipe, replaceWith } from './core';
import { nullary_ } from './macros';
import { withValue } from './stack';

describe("macro withValue", () => {
    test("", nullary_(pipe([
        replaceWith(333),
        withValue(22, pipe([
            (val) => expect(val).toBe(22),
        ])),
        (val) => expect(val).toBe(333),
    ])));
});