/* istanbul ignore file */
import { setProcessExit } from "./environment";

setProcessExit(process.exit.bind(process));

export { boolean } from "./boolean";
export { initialize } from "./environment";
export { kubernetesAddress } from "./kubernetes-address";
export { string } from "./string";
