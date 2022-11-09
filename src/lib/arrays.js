export const map_ = (transform) => (array) => {
    return Promise.all(array.map(transform));
};



export const onEach_ = map_;
export const forEach_ = map_;
export const withEach_ = map_;
export const onElements_ = map_;
export const forElements_ = map_;
export const withElements_ = map_;
export const oneByOne_ = map_;
export const individually_ = map_;
