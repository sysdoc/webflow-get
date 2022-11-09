import { sideEffect } from "./core";

export const withValue = (value, transform) => {
    return sideEffect(transform(value));
}

export const createStack_ = withValue;
export const newStack_ = withValue;
export const stack_ = withValue;
export const stackWith_ = withValue;
export const stackUsing_ = withValue;

export const spread_ = (fn) => (values) => fn(...values);
export const spreadCall_ = spread_;
export const spreadOnto_ = spread_;
export const spreadInto_ = spread_;
export const spreadFor_ = spread_;
export const passAsArgs_ = spread_;

export const currySpread_ = (fn) => (values) => values.reduce((fn, value) => fn(value), fn);
export const deepCall_ = currySpread_;
