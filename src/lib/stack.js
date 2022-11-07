import { sideEffect } from "./core";

export const withValue = (value, transform) => {
    return sideEffect(transform(value));
}