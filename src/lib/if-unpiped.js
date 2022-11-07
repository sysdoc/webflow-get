export const if_ = (predicate, trueTransform) => {
    return async (value) => {
        if (await predicate(value)) {
            return await trueTransform(value);
        }
    };
};
