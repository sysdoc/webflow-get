export const nullary_ = (fn) => () => fn();

export const unary_ = (fn) => (value) => fn(value);
