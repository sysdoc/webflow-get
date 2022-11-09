import { describe, expect, test } from '@jest/globals';
import { pipe, replaceWith } from './core';
import { nullary_ } from './macros';
import { maybe_ } from './maybe';
import { prop } from './std';

describe("macro maybe_", () => {

    test("", nullary_(pipe([
        replaceWith({ user: { account: { balance: 22 } } }),
        maybe_([prop("user"), prop("account"), prop("balance")]),
        (val) => expect(val).toBe(22),
    ])));

    test("", nullary_(pipe([
        replaceWith({ user: { account: { balance: 22 } } }),
        maybe_([prop("guest"), prop("account"), prop("balance")]),
        (val) => expect(val).toBe(undefined),
    ])));

});