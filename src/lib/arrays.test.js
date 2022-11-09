import { describe, expect, test } from '@jest/globals';
import { eq_, pipe, replaceWith } from './core';
import { if_ } from './if-unpiped';
import { nullary_ } from './macros';

describe("macro if_ unpiped", () => {

    test("", nullary_(pipe([
        replaceWith(22),
        if_(eq_(22), replaceWith(333)),
        (val) => expect(val).toBe(333),
    ])));
    
});


