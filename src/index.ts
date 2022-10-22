/* istanbul ignore file */
import { setProcessExit } from "./environment";

setProcessExit(process.exit.bind(process));

export { bigInteger } from "./declaration/big-integer";
export { boolean } from "./declaration/boolean";
export { duration } from "./declaration/duration";
export { enumeration } from "./declaration/enumeration";
export { integer } from "./declaration/integer";
export { kubernetesAddress } from "./declaration/kubernetes-address";
export { number } from "./declaration/number";
export { string } from "./declaration/string";
export { initialize } from "./environment";
