import { describe, expect, test } from '@jest/globals';
import { pipe, replaceWith } from './core';
import { nullary_ } from './macros';
import { stack_ } from './stack';

describe("macro stack_", () => {
    test("", nullary_(stack_(22, pipe([
        stack_(333, pipe([
            (val) => expect(val).toBe(333),
        ])),
        (val) => expect(val).toBe(22),
    ]))));
});



describe("macro pipe2", () => {

    test("", nullary_(pipe([

    ])))

});