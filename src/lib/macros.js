import { function_, if_, isArray, isBoolean, isNumber, isObject, isString, isUndefined, throwError } from "./core";
import { call, not } from "./std";

export const nullary_ = (fn) => () => fn();

export const unary_ = (fn) => (value) => fn(value);



export const memoized_ = (fn) => (value) => fn(value);


export const optional_ = (fn) => (value) => {
    if (value === undefined) {
        return undefined;
    }

    return fn(value);
};



export const stringFunction_ = (transformations) => function_([
    assert_(isString),
    ...transformations,
]);
export const numberFunction_ = (transformations) => function_([
    assert_(isNumber),
    ...transformations,
]);
export const arrayFunction_ = (transformations) => function_([
    assert_(isArray),
    ...transformations,
]);
export const booleanFunction_ = (transformations) => function_([
    assert_(isBoolean),
    ...transformations,
]);
export const objectFunction_ = (transformations) => function_([
    assert_(isObject),
    ...transformations,
]);



export const allTrue_ = (...pipes) => (value) => true;
export const anyTrue_ = (...pipes) => (value) => true;
export const allFalse_ = (...pipes) => (value) => false;
export const anyFalse_ = (...pipes) => (value) => false;
export const either_ = anyTrue_;
export const neither_ = allFalse_;



export const assert_ = (predicate) => {
    return if_([predicate, not], [
        throwError("Type error"),
    ]);
};



export const merge_ = (object) => (value) => {
    return {};
}

export const wrap_ = merge_;


export const sideEffect_ = (transformations) => (value) => {
    function_([transformations])(value);
    return value;
}