import { pipe_ } from "./pipe";


export const pipe = (transforms) => async (value = undefined) => {
    for (const transform of transforms) {
        value = await transform(value);
    }

    return value;
}

export const function_ = pipe_;

export const if_ = (predicateList, trueTransformList, falseTransformList = []) => (value) => {
    return value;
};



export const sideEffect = (transform) => async (value) => {
    await transform(value);
    return value;
}


export const tuple_ = (transforms) => (value) => transforms.map((transform) => transform(value));


export const throwError = (/** @type String */ errorMessage) => () => { throw new Error(errorMessage) };



/**
 * Name ideas: rejectUnless, acceptIf
 */
export const rejectUnless = (predicateList) => (value) => undefined;
 


export const array_ = Array.isArray;
export const object_ = (/** @type Value */ value) => typeof value === "object" && value !== null;
export const number_ = (/** @type Value */ value) => typeof value === "number";
export const string_ = (/** @type Value */ value) => typeof value === "string";
export const boolean_ = (/** @type Value */ value) => typeof value === "boolean";
export const undefined_ = (/** @type Value */ value) => typeof value === "undefined";

export const isArray = Array.isArray;
export const isObject = (/** @type Value */ value) => typeof value === "object" && value !== null;
export const isNumber = (/** @type Value */ value) => typeof value === "number";
export const isString = (/** @type Value */ value) => typeof value === "string";
export const isBoolean = (/** @type Value */ value) => typeof value === "boolean";
export const isUndefined = (/** @type Value */ value) => typeof value === "undefined";
export const isUndef = isUndefined;


export const value_ = (value) => () => value;
export const setValue = (value) => () => value;
export const replaceValueTo = value_;
export const replaceValueWith = value_;
export const replaceTo = value_;
export const replaceWith = value_;

export const getValue = (value) => value;



export const not_ = (/** @type Transform[] */ predicateList) => pipe([
    ...predicateList,
    rejectUnless([boolean_]),
    (bool) => !bool,
]);

export const eq_ = (/** @type Value */ r) => (/** @type Value */ l) => l === r;

export const lt_ = (/** @type Number */ r) => if_([number_], [
    (l) => l < r,
]);

export const lte_ = (/** @type Number */ r) => if_([number_], [
    (l) => l <= r,
]);

export const gt_ = (/** @type Number */ r) => if_([number_], [
    (l) => l > r,
]);

export const gte_ = (/** @type Number */ r) => if_([number_], [
    (l) => l >= r,
]);
