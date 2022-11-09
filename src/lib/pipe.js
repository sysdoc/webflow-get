export const pipe_ = (transforms) => async (value = undefined) => {
    for (const transform of transforms) {
        value = await transform(value);

        if (Array.isArray(value)) {
            value = await Promise.all(value);
        }
    }

    return value;
};

