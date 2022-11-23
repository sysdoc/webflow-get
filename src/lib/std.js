export const increaseBy = (amount) => (value) => value + amount;

export const decreaseBy = (amount) => (value) => value - amount;

export const clamp = (lowerBound, upperBound) => (value) => Math.max(lowerBound, Math.min(value, upperBound));



export const prop = (key) => (value) => value?.[key];
export const property = prop;



export const callMethod = (/** @type String */ methodName, /** @type Array */ args) => (value) => {
    return value?.[methodName]?.(...args);
};



export const constant = (value) => () => value;
export const value = constant;

export const identity = () => (value) => value;
export const currentValue = identity;
export const useCurrentValue = identity;



export const not_ = (predicate) => (value) => !predicate(value);
export const not = (value) => !value;

export const isTrue = (value) => value;
export const isFalse = (value) => !value;



export const call = (fn) => fn();



export const isEq = (/** @type Value */ r) => (/** @type Value */ l) => l === r;

export const isLt = (/** @type Number */ r) => (l) => l < r;

export const isLtEq = (/** @type Number */ r) => (l) => l <= r;

export const isGt = (/** @type Number */ r) => (l) => l > r;

export const isGtEq = (/** @type Number */ r) => (l) => l >= r;




export const format = (/** @type String */ template) => (value) => template.replace("{}", typeof value === "object" ? JSON.stringify(value) : value);
export const interpolate = format;
export const substitute = format;
