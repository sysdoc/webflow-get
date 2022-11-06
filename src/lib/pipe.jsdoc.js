
/**
 * @template I
 * @template O
 * @typedef {(value?: I) => O | Promise<O>} Transform
 */

/**
 * @template I
 * @template O
 * @typedef {[]} Transforms_0
 */

/**
 * @template I
 * @template O
 * @typedef {[
 *  Transform<I, O>
 * ]} Transforms_1
 */

/**
 * @template I
 * @template A
 * @template O
 * @typedef {[
 *  Transform<I, A>,
 *  Transform<A, O>,
 * ]} Transforms_2
 */

/**
 * @template I
 * @template A
 * @template B
 * @template O
 * @typedef {[
 *  Transform<I, A>,
 *  Transform<A, B>,
 *  Transform<B, O>,
 * ]} Transforms_3
 */

/**
 * @template I
 * @template A
 * @template B
 * @template C
 * @template O
 * @typedef {[
 *  Transform<I, A>,
 *  Transform<A, B>,
 *  Transform<B, C>,
 *  Transform<C, O>,
 * ]} Transforms_4
 */

/**
 * @template I
 * @template A
 * @template B
 * @template C
 * @template D
 * @template O
 * @typedef {[
 *  Transform<I, A>,
 *  Transform<A, B>,
 *  Transform<B, C>,
 *  Transform<C, D>,
 *  Transform<D, O>,
 * ]} Transforms_5
 */


/**
 * @template I
 * @template A
 * @template B
 * @template C
 * @template D
 * @template O
 * @typedef {Transforms_0<I, O> |
 *  Transforms_1<I, O> |
 *  Transforms_2<I, A, O> |
 *  Transforms_3<I, A, B, O> |
 *  Transforms_4<I, A, B, C, O> |
 *  Transforms_5<I, A, B, C, D, O>
 * } Transforms
 */

/**
 * @template I
 * @template A
 * @template B
 * @template C
 * @template D
 * @template O
 * @typedef {(transforms: Transforms<I, A, B, C, D, O>) => Transform<I, O>} Pipe
 */
