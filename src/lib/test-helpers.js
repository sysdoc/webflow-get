import { describe, expect, test } from '@jest/globals';
import { function_ } from './core';
import { nullary_ } from './macros';

export const testCase_ = (transformations) => {
    test("", nullary_(function_(transformations)));
}


export const expectToBe = (expectedValue) => (value) => {
    expect(value).toBe(expectedValue);
    return value;
}