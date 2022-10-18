/* istanbul ignore file */
import { setProcessExit } from "./environment";

setProcessExit(process.exit.bind(process));

export { boolean } from "./boolean";
export { duration } from "./duration";
export { enumeration } from "./enumeration";
export { initialize } from "./environment";
export { kubernetesAddress } from "./kubernetes-address";
export { number } from "./number";
export { string } from "./string";
