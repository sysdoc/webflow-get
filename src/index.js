import { updateSnapshot } from "./utilities.js";



async function main() {
    await updateSnapshot();
}

main()
    .then(() => {
        console.log('Executed successfully');
    })
    .catch((error) => {
        console.error(error);
        core.setFailed(error.message);
    });
