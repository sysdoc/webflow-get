

export const getProperty = (key) => (object) => object[key];


export const equals = (b) => (a) => a === b;
export const lt = (b) => (a) => a < b;
export const lte = (b) => (a) => a <= b;
export const gt = (b) => (a) => a > b;
export const gte = (b) => (a) => a >= b;


export function funnel(schema) {
    return function (value) {
        return pipe([
            () => schema,
            Object.entries,
            map(([k, transformer]) => [k, transformer(value)]),
            Object.fromEntries,
        ])();
    };
}

/* name ideas: branchOff, diverge, fork, effect, sideEffect */
export function branchOff(step) {
    return function (value) {
        return value;
    };
}

export const map = (transformer) => (array) => array.map(transformer);



/**
 * @param  {Array<(arg: any) => any> | () => Array<(arg: any) => any>} transforms
 * @return {(arg: any) => any}
 */

export function pipe(transforms) {
    // let returnStatement = undefined;

    // function setReturnValue(value) {
    //     if (returnStatement) {
    //         return;
    //     }

    //     returnStatement = {
    //         value,
    //     };

    //     throw returnStatement;
    // }

    // if (typeof steps === "function") {
    //     steps = steps({ returnValue: setReturnValue })
    // }

    return async function (value) {
        for (const transform of transforms) {
            // try {
            value = await transform(value);
            // } catch (exception) {
            //     if (exception !== returnStatement) {
            //         throw exception;
            //     }

            //     return returnStatement.value;
            // }
        }

        return value;
    };
}





// NOTE: Every transform and branchOff function should handle the unfeined input case internally
// either by returning a default value, or by returning undefined
// This makes the functions code more fool-proof, 
// bacause handling the undefined case can't be forgotten when using the functions

// RULE: every data argument of a function should be optional




// // name ideas: pipeOk, pipeWhileOk, pipeOptionally
// export function pipeWhileOk(transforms, nullishTransform) {

// }


// // name ideas: divertIfNullish
// export function returnIfNullish(transforms, nullishTransform) {

// }

// // name ideas: replaceNullish, useIfNullish
// export function replaceNullish(transform) {

// }

// /** Takes the first transformation which gives non-nullish result
//  * @param {Array<(value: any) => any>} transforms 
//  */
// // name ideas: tryUntilOk, takeFirstOk, takeSuccessful, takeOk, pickFirstOk, useFirstOk, attempt, chooseFirstSuccessful, chooseFirstOk, pullFirstOk, getFirstOk, goWithFirstOk, selectFirstOk, giveOpportunity, backUpChain, options, bestCase, firstSuccess, firstSucceed, winner, defaultChain
// // PROBLEM: nullish value can come from the pipe input value too
// export function tryUntilOk(transforms) {

// }

// const transform1 =
//     tryUntilOk([
//         pipeWhileOk([
//             getIdFromUrl,
//             fetchRecord,
//         ]),
//         () => ({
//             title: "",
//             description: "",
//         })
//     ])

// const fetchRecord =
//     check(isNullish)({
//         true: () => ({
//             title: "",
//             description: "",
//         }),
//         false: pipe([

//         ]),
//     });

// const transform2 =
//     pipe([
//         getIdFromUrl,
//         fetchRecord,
//     ])

// /**
//  * @param  {(value: any) => boolean | Promise<boolean>} predicate
//  */

// export function if_(predicate) {
//     return {
//         then_(step) {
//             return async function (value) {
//                 if (await predicate(value)) {
//                     return await step(value);
//                 }

//                 return value;
//             }
//         }
//     }
// }



/** 
 * @param  {(value: any) => boolean | Promise<boolean>} getOtherValue
 */

export function equals_(getOtherValue) {
    return async function (value) {
        return (value === await getOtherValue(value));
    }
}



// const getLocalSnapshotDate = pipe([
//     () => ("last-snapshot.json"),
//     getFileUriContent,
//     JSON.parse,
//     getProperty("localSnapshotTimestamp"),

//     if_(equals_(() => (undefined))).then_(
//         () => ("1970-01-01T00:00:00Z"),
//     ),
// ]);