
/**
 * @param  {Array<(arg: any) => any>} transforms
 * @return {(arg: any) => any}
 */

export const pipe = (transforms) => async (value) => {
    for (const transform of transforms) {
        value = await transform(value);
    }

    return value;
}



// NOTE: Every transform and branchOff function should handle the unfeined input case internally
// either by returning a default value, or by returning undefined
// This makes the functions code more fool-proof, 
// bacause handling the undefined case can't be forgotten when using the functions

// RULE: every data argument of a function should be optional


/**
 * @param {T} value 
 * @returns {() => T}
 */
export const use = (value) => () => value;

export const eq = (r) => (l) => l === r;
export const lt = (r) => (l) => l < r;
export const lte = (r) => (l) => l <= r;
export const gt = (r) => (l) => l > r;
export const gte = (r) => (l) => l >= r;

const isEq = (r) => (l) => l === r;
const isLt = (r) => (l) => l < r;
const isLtEq = (r) => (l) => l <= r;
const isGt = (r) => (l) => l > r;
const isGtEq = (r) => (l) => l >= r;

const assertEq = (r) => (l) => l === r;
const assertLt = (r) => (l) => l < r;
const assertLtEq = (r) => (l) => l <= r;
const assertGt = (r) => (l) => l > r;
const assertGtEq = (r) => (l) => l >= r;

const checkIsEq = (r) => (l) => l === r;
const checkIsLt = (r) => (l) => l < r;
const checkIsLtEq = (r) => (l) => l <= r;
const checkIsGt = (r) => (l) => l > r;
const checkIsGtEq = (r) => (l) => l >= r;


export const map = (transform) => (array) => array.map(transform);

export const getProp = (key) => (object) => object[key];
export const getProperty = (key) => (object) => object[key];

// TODO: not a verb
export const startsWith = (subString) => (string) => string.startsWith(subString);


export const unless_ = (test) => (transforms) => (value) => {
    if (!test(value)) {
        return pipe(transforms)(value);
    }

    return value;
}

export const if_ = (test) => (transforms) => (value) => {
    if (test(value)) {
        return pipe(transforms)(value);
    }

    return value;
}

/**
 * 
 * @param {Array} transforms 
 * @returns {(value: T) => T}
 */
/* name ideas: branchOff, diverge, fork, effect, sideEffect */
export const branchOff_ = (transforms) => (value) => {
    pipe(transforms)(value);
    return value;
}

export const log = branchOff_([
    console.log,
]);





/**
 * 
 * @param {RegExp | undefined} regex 
 * @returns {(string: string | undefined) => Array<string>}
 */
export const captureMatches = (regex) => pipe([
    (string) => string ? string.matchAll(regex) : [],
    Array.from,
    map(getProperty(1)),
]);





export function funnel(schema) {
    return function (value) {
        return pipe([
            () => schema,
            Object.entries,
            map(([k, transform]) => [k, transform(value)]),
            Object.fromEntries,
        ])();
    };
}

