import { describe, expect, test } from '@jest/globals';
import { function_, getValue, if_, lt_, not_, pipe, replaceWith, setValue, sideEffect, value_ } from './core';
import { nullary_ } from './macros';
import { isFalse, isGtEq, isLt, prop } from './std';
import { expectToBe, testCase_ } from './test-helpers';

describe("macro if_", () => {

    testCase_([
        setValue(3),
        if_([isGtEq(5)], {
            then: [setValue("larger")],
            else: [setValue("smaller")],
        }),
        expectToBe("smaller"),
    ]);

    testCase_([
        setValue({}),
        if_([prop("ok"), isFalse], {
            then: [
                setValue(undefined),
            ],
            else: [
                setValue({}),
            ],
        }),
    ]);

    testCase_([
        setValue({}),
        if_([prop("ok"), isFalse], {
            then: [setValue(undefined)],
            else: [setValue({})],
        }),
    ]);

    testCase_([
        setValue({}),
        if_([prop("ok"), isFalse], {
            then: [setValue(undefined)],
        }),
        expectToBe(undefined),
    ]);

});

describe("macro sideEffect", () => {
    test("", nullary_(pipe([
        replaceWith(42),
        sideEffect(replaceWith(245)),
        (val) => expect(val).toBe(42),
    ]);
});