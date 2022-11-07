import { describe, expect, test } from '@jest/globals';
import { if_, lt_, not_, pipe, replaceWith, sideEffect, value_ } from './core';
import { nullary_ } from './macros';

describe("if expression", () => {

    test("", async () => await pipe([
        value_(3),
        if_([not_([lt_(5)])], [
            value_("smaller"),
        ], [
            value_("larger"),
        ]),
        (value) => expect(value).toBe(),
    ])());

});

describe("macro sideEffect", () => {
    test("", nullary_(pipe([
        replaceWith(42),
        sideEffect(replaceWith(245)),
        (val) => expect(val).toBe(42),
    ])));
});