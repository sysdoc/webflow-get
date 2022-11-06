
export const pipe = /** @type Pipe */ (transforms) => async (value = undefined) => {
    for (const transform of transforms) {
        value = await transform(value);
    }

    return value;
}

/**
 * @typedef {void | undefined | boolean | number | string | Promise | {[x: string]: Value} | {[x: number]: Value}} Value
 */

/**
 * @template {Value} [I=Value]
 * @template {Value} [O=Value]
 * @typedef {(value?: I) => O | Promise<O>} Transform
 */

/**
 * @template {Value} [I=Value]
 * @template {Value} [O=Value]
 * @typedef {(transforms: Transform<I, O>[]) => Transform<I, O>} Pipe
 */

/** Other name ideas: patch, passTo, unary, constrain
 * @template {Value} I
 * @template {(value: I, ...values: any) => Value} T
 */
export const passTo = (/** @type T */ fn) => (/** @type I */ value) => fn(value);



// NOTE: Every transform and branchOff function should handle the unfeined input case internally
// either by returning a default value, or by returning undefined
// This makes the functions code more fool-proof, 
// bacause handling the undefined case can't be forgotten when using the functions

// RULE: every data argument of a function should be optional



export const unless_alt = (/** @type Transform[] */ testTransforms) => ({
    then: (/** @type Transform[] */ transforms) => async (/** @type Value */ value = undefined) => {
        if (!await pipe(testTransforms)(value)) {
            return await pipe(transforms)(value);
        }

        return value;
    },
});




export const if_ = (/** @type Transform[] */ testTransforms) => ({
    /** @template {Value} T */
    then: (/** @type Transform[] */ transforms) => async (/** @type T */ value = undefined) => {
        if (await pipe(testTransforms)(value)) {
            return await pipe(transforms)(value);
        }

        return value;
    },
});


export const isArray = passTo(Array.isArray);
export const isObject = (/** @type Value */ value) => typeof value === "object" && value !== null;
export const isNumber = (/** @type Value */ value) => typeof value === "number";
export const isString = (/** @type Value */ value) => typeof value === "string";
export const isBoolean = (/** @type Value */ value) => typeof value === "boolean";
export const isUndefined = (/** @type Value */ value) => typeof value === "undefined";

export const assert = (/** @type Transform[] */ testTransforms) => unless_alt(testTransforms).then([
    throwError("Type Error"),
]);

export const throwError = (/** @type String */ errorMessage) => () => { throw new Error(errorMessage) };

/** @template {Value} T */
export const use = (/** @type T */ value) => () => value;

export const defaultTo = (/** @type Value */ defaultValue) => if_([isUndefined]).then([
    use(defaultValue),
]);

export const isEq = (/** @type Value */ r) => (/** @type Value */ l) => l === r;

export const isLt = (/** @type Number */ r) => if_([isNumber]).then([
    (l) => l < r,
]);

export const isLtEq = (/** @type Number */ r) => if_([isNumber]).then([
    (l) => l <= r,
]);

export const isGt = (/** @type Number */ r) => if_([isNumber]).then([
    (l) => l > r,
]);

export const isGtEq = (/** @type Number */ r) => if_([isNumber]).then([
    (l) => l >= r,
]);



export const not = if_([isBoolean]).then([
    (bool) => !bool,
]);

export const not_ = (/** @type Transform[] */ transforms) => pipe([
    ...transforms,
    assert([isBoolean]),
    (bool) => !bool,
]);

/**
 * @param {Array<(value?: any) => any>} transforms 
 */
export const map = (transforms) => if_([isArray]).then([
    callMethod("map").withArguments(pipe(transforms)),
    // passTo(Promise.all),
    (/** @type Array */ array) => Promise.all(array),
]);



/**
 * @param {Array<(value?: any) => any>} transforms 
 */
export const forEach = (/** @type Transform[] */ transforms) => if_([isArray]).then([
    sideEffect([
        callMethod("forEach").withArguments(pipe(transforms)),
    ]),
]);


export const getElement = (/** @type number */ index) => if_([isArray]).then([
    (value) => value[index],
]);

export const getProp = (/** @type String */ propertyKey) => if_([isObject]).then([
    (value) => value[propertyKey],
]);

export const getProperty = getProp;

/**
 * @param {string} methodName 
 */
export const callMethod = (methodName) => ({
    withArguments: (...args) => if_([isObject]).then([
        (value) => value[methodName](...args),
    ]),
});



export const startsWith = (/** @type String */ subString) => if_([isString]).then([
    callMethod("startsWith").withArguments(subString),
]);

/**
 * @param {Array<(value?: any) => any>} testTransforms 
 */
export const unless_ = (testTransforms) => (transforms) => async (value) => {
    if (!await pipe(testTransforms)(value)) {
        return await pipe(transforms)(value);
    }

    return value;
}


// name ideas: sideEffect, branchOff, diverge, fork, effect
export const sideEffect = (/** @type Transform[] */ transforms) => async (/** @type Value */ value = undefined) => {
    await pipe(transforms)(value);
    return value;
}


// name ideas: trace, dbg, log
export const log = sideEffect([
    (value) => console.log(`${JSON.stringify(value)}: ${value}`),
]);





export const captureMatches = (/** @type RegExp */ regex) => pipe([
    defaultTo(""),
    (/** @type String */ string) => Array.from(string.matchAll(regex)),
    map([getElement(1)]),
]);


// name ideas: isFirstOccurance, isFirstInstance, haveNotSeenYet
// name ideas: isRepetition, haveAlreadyEncountered, remember, isInMemory, isMemorised, isAlreadySeen
const isFirstOccurance = () => {
    const memorised = new Set();
    return couldAddTo(memorised);
}

const couldAddTo = (/** @type Set */ set) => (/** @tyep Value */ value) => {
    if (set.has(value)) {
        return false;
    }

    set.add(value);
    return true;
}

// name ideas: funnel, paralell, independently, waitForAll, 

// export function funnel(schema) {
//     return function (value) {
//         return pipe([
//             () => schema,
//             Object.entries,
//             map([([k, transform]) => [k, transform(value)]]),
//             Object.fromEntries,
//         ])();
//     };
// }

